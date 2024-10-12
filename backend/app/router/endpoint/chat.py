import os
from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import StreamingResponse
import httpx
import asyncio
from pydantic import BaseModel
from typing import Optional
import json
import re
import redis

app = FastAPI()
router = APIRouter()

# Redis 클라이언트 설정
REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379')
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# LLAMA 서버 URL 설정
SERVER_URL = os.getenv('LLAMA_SERVER_URL', 'http://llamacpp-server-gpu:8081')
LLAMA_SERVER_URL = f'{SERVER_URL}/completion'


class CompletionRequest(BaseModel):
    prompt: str
    temperature: float = 0.8
    top_k: int = 40
    top_p: float = 0.95
    min_p: float = 0.05
    n_predict: int = -1
    n_keep: int = 0
    stream: bool = True
    tfs_z: float = 1.0
    typical_p: float = 1.0
    repeat_penalty: float = 1.1
    repeat_last_n: int = 64
    penalize_nl: bool = True
    presence_penalty: float = 0.0
    frequency_penalty: float = 0.0
    mirostat: int = 0
    mirostat_tau: float = 5.0
    mirostat_eta: float = 0.1
    seed: int = -1
    ignore_eos: bool = False
    cache_prompt: bool = True
    system_prompt: str = ""
    session_id: str

class ChatSession:
    def __init__(self, session_id):
        self.session_id = session_id

    def add_message(self, role, content):
        # Redis에 대화 저장
        conversation = redis_client.get(self.session_id)
        if conversation:
            conversation = json.loads(conversation)
        else:
            conversation = {"system": "", "messages": []}
        
        if role == "system":
            conversation["system"] = content
        else:
            if "messages" not in conversation:
                conversation["messages"] = []
            conversation["messages"].append({"role": role, "content": content})
        
        redis_client.set(self.session_id, json.dumps(conversation))

    def get_full_prompt(self, current_user_input):
        # Redis에서 대화 불러오기
        conversation = redis_client.get(self.session_id)
        if conversation:
            conversation = json.loads(conversation)
            system_prompt = conversation.get("system", "")
            messages = conversation.get("messages", [])
            
            prompt = f"system: {system_prompt}\n\n"
            
            # 최근 대화 히스토리 (예: 최근 5개 메시지)
            recent_messages = messages[-5:]
            for msg in recent_messages:
                role = "user" if msg["role"] == "user" else "assistant"
                prompt += f"{role}: {msg['content']}\n"
        else:
            prompt = ""

        # 현재 질문 추가
        prompt += f"user: {current_user_input}\nassistant: "
        print("Generated Prompt:")
        print(prompt)
        return prompt

async def fetch_llama_stream(data: CompletionRequest, chat_session: ChatSession):
    async with httpx.AsyncClient() as client:
        async with client.stream('POST', LLAMA_SERVER_URL, json=data.dict()) as response:
            assistant_response = ""
            async for chunk in response.aiter_text():
                try:
                    cleaned_chunk = re.sub(r'^data: ', '', chunk)
                    json_data = json.loads(cleaned_chunk)
                    assistant_response += json_data.get("content", "")
                    yield json.dumps(json_data)
                except json.JSONDecodeError:
                    yield chunk
            # 어시스턴트의 응답을 대화에 추가
            chat_session.add_message("assistant", assistant_response)

@router.post("/generate")
async def generate(request: CompletionRequest):
    # 세션 ID를 사용하여 ChatSession 생성
    session_id = request.session_id
    print(session_id)
    chat_session = ChatSession(session_id)
    
    # 시스템 프롬프트 설정 (처음 한 번만)
    if request.system_prompt:
        chat_session.add_message("system", request.system_prompt)
    
    # 현재 질문을 추가하기 전에 프롬프트 생성
    full_prompt = chat_session.get_full_prompt(request.prompt)
    
    # 현재 질문을 대화에 추가
    chat_session.add_message("user", request.prompt)
    
    # 프롬프트를 요청에 설정
    request.prompt = full_prompt
    
    return StreamingResponse(fetch_llama_stream(request, chat_session), media_type="application/json")
