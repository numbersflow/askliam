import { ChatMessage, ServerUsage, InferenceSettings } from './types';

const API_URL = 'http://localhost:8000/api/v1';  // FastAPI 서버 URL을 적절히 변경하세요

export async function sendMessage(message: string, images: string[], settings: InferenceSettings): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        images,  // 이미지 데이터 추가
        ...settings,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to send message: ${errorData.detail || response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    return response.body;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;  // 에러를 다시 던져서 호출하는 쪽에서 처리할 수 있게 함
  }
}

export async function getServerUsage(): Promise<ServerUsage> {
  // TODO: Implement actual API call when backend provides this functionality
  return {
    cpuUsage: Math.round(Math.random() * 100) + '%',
    gpuUsage: Math.round(Math.random() * 100) + '%',
    totalTime: '00:' + Math.round(Math.random() * 59).toString().padStart(2, '0') + ':' + Math.round(Math.random() * 59).toString().padStart(2, '0'),
    vramUsage: Math.round(Math.random() * 16) + 'GB'
  };
}

export async function updateInferenceSettings(settings: InferenceSettings): Promise<InferenceSettings> {
  // TODO: Implement actual API call when backend provides this functionality
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(settings);
    }, 500);
  });
}