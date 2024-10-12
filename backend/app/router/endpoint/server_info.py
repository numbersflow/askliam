import psutil
import torch
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter()

class ServerMetrics(BaseModel):
    cpu_usage: float
    memory_usage: float
    gpu_name: Optional[str] = None
    gpu_usage: Optional[float] = None
    vram_usage: Optional[float] = None

@router.get("/metrics", response_model=ServerMetrics)
async def get_server_metrics():
    # CPU 사용률
    cpu_usage = round(psutil.cpu_percent(), 2)
    
    # 메모리 사용률
    memory = psutil.virtual_memory()
    memory_usage = round(memory.percent, 2)
    
    # GPU 정보 (torch 사용)
    gpu_name = None
    gpu_usage = None
    vram_usage = None
    
    if torch.cuda.is_available():
        gpu_name = torch.cuda.get_device_name(0)
        gpu_usage = round(torch.cuda.utilization(0), 2)
        vram_usage = round(torch.cuda.memory_allocated(0) / torch.cuda.get_device_properties(0).total_memory * 100, 2)
    
    return ServerMetrics(
        cpu_usage=cpu_usage,
        memory_usage=memory_usage,
        gpu_name=gpu_name,
        gpu_usage=gpu_usage,
        vram_usage=vram_usage
    )