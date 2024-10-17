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
    temperature: float = 0.2
    top_k: int = 20
    top_p: float = 0.65
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
    system_prompt: Optional[str] = None
    session_id: str
    image_data: Optional[List[ImageData]] = None
    max_context_length: int = 8192  # 모델의 최대 컨텍스트 길이
    stop: List = ["0", "0", "0", "0"]


@router.post("/generate")
async def generate(request: CompletionRequest):
    session_id = request.session_id
    print(session_id)
    
    # Retrieve conversation from Redis
    conversation = redis_client.get(session_id)
    previous_user = ""
    previous_assistant = ""
    present_user = request.prompt
    
    
    if conversation:
        # If there is previous conversation, extract the last user and assistant messages
        conversation = json.loads(conversation)
        if conversation:
            previous_user = conversation[-1]['user'][:30]
            previous_assistant = conversation[-1]['assistant'][:30]

    # Construct the full prompt using the template
    full_prompt = (
        f"system: {request.system_prompt}\n"
        f"user: {previous_user}\n"
        f"assistant: {previous_assistant}\n"
        f"user: {present_user}\n"
        f"assistant: "
    )
    
    print("Generated Prompt:")
    print(full_prompt)

    # Set the prompt in the request
    request.prompt = full_prompt
    
    # Calculate the input length
    input_length = len(full_prompt)
    print(request.max_context_length - input_length - 300)
    # Dynamically set n_predict
    request.n_predict = max(0, request.max_context_length - input_length - 300)
    
    # Send request to LLaMA server
    return StreamingResponse(fetch_llama_stream(request, present_user, session_id), media_type="application/json")


async def fetch_llama_stream(data: CompletionRequest, present_user: str, session_id: str):
    async with httpx.AsyncClient() as client:
        request_data = data.dict(exclude_unset=True)
        
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
            
            # Store only the current user and assistant messages in Redis
            new_entry = {
                "user": present_user,
                "assistant": assistant_response
            }
            
            # Append the new entry to the existing conversation
            conversation = redis_client.get(session_id)
            if conversation:
                conversation = json.loads(conversation)
            else:
                conversation = []

            conversation.append(new_entry)
            redis_client.set(session_id, json.dumps(conversation))