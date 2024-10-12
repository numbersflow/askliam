import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ServerUsage {
  cpu_usage: number;
  memory_usage: number;
  gpu_name: string | null;
  gpu_usage: number | null;
  vram_usage: number | null;
}

async function getServerUsage(): Promise<ServerUsage> {
  try {
    const response = await axios.get<ServerUsage>('http://localhost:9070/api/v1/metrics');
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