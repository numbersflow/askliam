from fastapi import FastAPI, APIRouter
from pydantic import BaseModel
from typing import Optional

import psutil
import GPUtil

app = FastAPI()
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
    
    # GPU 정보 (사용 가능한 경우)
    gpus = GPUtil.getGPUs()
    gpu_name = None
    gpu_usage = None
    vram_usage = None
    
    if gpus:
        gpu = gpus[0]  # 첫 번째 GPU 사용
        gpu_name = gpu.name  # GPU 이름
        gpu_usage = round(gpu.load * 100, 2)  # GPU 사용률 (%)
        vram_usage = round(gpu.memoryUsed / gpu.memoryTotal * 100, 2)  # VRAM 사용률 (%)
    
    return ServerMetrics(
        cpu_usage=cpu_usage,
        memory_usage=memory_usage,
        gpu_name=gpu_name,
        gpu_usage=gpu_usage,
        vram_usage=vram_usage
    )