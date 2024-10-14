import psutil
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import pynvml

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
    
    # GPU 정보 (pynvml 사용)
    gpu_name = None
    gpu_usage = None
    vram_usage = None
    
    try:
        pynvml.nvmlInit()
        handle = pynvml.nvmlDeviceGetHandleByIndex(0)
        gpu_name = pynvml.nvmlDeviceGetName(handle).decode('utf-8')
        utilization = pynvml.nvmlDeviceGetUtilizationRates(handle)
        gpu_usage = utilization.gpu
        memory_info = pynvml.nvmlDeviceGetMemoryInfo(handle)
        vram_usage = round(memory_info.used / memory_info.total * 100, 2)
    except pynvml.NVMLError:
        # GPU를 찾을 수 없거나 NVIDIA 드라이버가 설치되지 않은 경우
        pass
    finally:
        if pynvml.nvmlShutdown:
            pynvml.nvmlShutdown()
    
    return ServerMetrics(
        cpu_usage=cpu_usage,
        memory_usage=memory_usage,
        gpu_name=gpu_name,
        gpu_usage=gpu_usage,
        vram_usage=vram_usage
    )