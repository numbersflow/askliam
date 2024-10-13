import os
from fastapi import FastAPI, APIRouter, Request
from fastapi.responses import StreamingResponse
import httpx
import asyncio
from pydantic import BaseModel
from typing import Optional, List
import json
import re
import redis

from app.core.settings import ENVIRONMENT

router = APIRouter()

# Redis 클라이언트 설정
REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379')
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# LLAMA 서버 URL 설정
SERVER_URL = os.getenv('LLAMA_SERVER_URL', 'http://llamacpp-server-gpu:8081')
LLAMA_SERVER_URL = f'{SERVER_URL}/completion'

class ImageData(BaseModel):
    data: str
    id: int

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
    image_data: Optional[List[ImageData]] = None

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
            
            # 가장 최근의 대화 메시지 하나만 사용
            if messages:
                last_message = messages[-1]
                role = "user" if last_message["role"] == "user" else "assistant"
                # 메시지를 100자까지만 잘라서 사용
                content = last_message["content"][:100]
                prompt += f"{role}: {content}\n"
        else:
            prompt = ""

        # 현재 질문 추가
        prompt += f"user: {current_user_input}\nassistant: "
        print("Generated Prompt:")
        print(prompt)
        return prompt

async def fetch_llama_stream(data: CompletionRequest, chat_session: ChatSession):
    async with httpx.AsyncClient() as client:
        request_data = data.dict(exclude_unset=True)
        
        # 이미지 데이터가 있는 경우에만 image_data 필드 포함
        if data.image_data:
            request_data['image_data'] = [img.dict() for img in data.image_data]
        else:
            request_data.pop('image_data', None)

        async with client.stream('POST', LLAMA_SERVER_URL, json=request_data) as response:
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
