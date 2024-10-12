from fastapi import APIRouter
from app.router.endpoint import chat, server_info

api_router = APIRouter()
api_router.include_router(chat.router, tags=['chat'])
api_router.include_router(server_info.router, tags=['server_info'])
