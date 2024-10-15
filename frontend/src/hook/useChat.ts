import { InferenceSettings } from '../components/AskLiam/types';

const FRONT_ACTIVATE = process.env.REACT_APP_FRONT_ACTIVATE;

const BASE_URL = FRONT_ACTIVATE === 'prod' 
  ? 'https://ai.pocketjob.co.kr'
  : 'http://localhost:8000';
  
const API_URL = `${BASE_URL}/api/v1`;

interface ImageData {
  data: string;
  id: number;
}

export async function sendMessage(message: string, images: string[], settings: InferenceSettings, systemPrompt: string, sessionId: string): Promise<ReadableStream<Uint8Array> | null> {
  try {

    const imageData: ImageData[] = images.map((image, index) => ({
      data: image,
      id: index + 1
    }));

    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: message,
        system_prompt: systemPrompt,
        session_id: sessionId,
        image_data: imageData,
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