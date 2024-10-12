import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// 환경 변수에서 API URL을 가져옵니다. 설정되지 않은 경우 기본값을 사용합니다.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:9070/api/v1';

interface ServerUsage {
  cpu_usage: number;
  memory_usage: number;
  gpu_name: string | null;
  gpu_usage: number | null;
  vram_usage: number | null;
}

async function getServerUsage(): Promise<ServerUsage> {
  try {
    const response = await axios.get<ServerUsage>(`${API_URL}/metrics`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch server usage:', error);
    return {
      cpu_usage: 0,
      memory_usage: 0,
      gpu_name: null,
      gpu_usage: null,
      vram_usage: null
    };
  }
}

export function useServerUsage() {
  const [serverUsage, setServerUsage] = useState<ServerUsage>({
    cpu_usage: 0,
    memory_usage: 0,
    gpu_name: null,
    gpu_usage: null,
    vram_usage: null
  });

  const updateServerUsage = useCallback(async () => {
    const usage = await getServerUsage();
    setServerUsage(usage);
  }, []);

  useEffect(() => {
    updateServerUsage();
    const intervalId = setInterval(updateServerUsage, 5000);
    return () => clearInterval(intervalId);
  }, [updateServerUsage]);

  return { serverUsage, updateServerUsage };
}