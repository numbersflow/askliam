export type MessageContent = 
  | string 
  | { type: 'graph', data: any[] }
  | { type: 'image', url: string }
  | { type: 'table', data: any[] }
  | { type: 'file', name: string, url: string }

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: MessageContent;
  images?: string[];
};