import { InferenceSettings } from '../components/AskLiam/types';

// 환경 변수에서 API URL을 가져오고 API 경로를 추가합니다.
const BASE_URL = process.env.REACT_APP_API_URL || 'http://114.110.135.85:8080';
const API_URL = `${BASE_URL}/api/v1`;

export async function sendMessage(message: string, images: string[], settings: InferenceSettings, systemPrompt: string, sessionId: string): Promise<ReadableStream<Uint8Array> | null> {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        system_prompt: systemPrompt,
        session_id: sessionId,
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