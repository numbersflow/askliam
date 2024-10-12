export interface ChatMessage {
    role: 'user' | 'assistant';
    content: MessageContent;
    images?: string[];
  }
  
  export type MessageContent =
    | string
    | { type: 'graph'; data: any[] }
    | { type: 'table'; data: any[] }
    | { type: 'image'; url: string }
    | { type: 'file'; name: string; url: string };
  
  export interface ServerUsage {
    cpuUsage: string;
    gpuUsage: string;
    totalTime: string;
    vramUsage: string;
  }
  
  export interface InferenceSettings {
    temperature: number;
    top_k: number;
    top_p: number;
    min_p: number;
    n_predict: number;
    n_keep: number;
    stream: boolean;
    tfs_z: number;
    typical_p: number;
    repeat_penalty: number;
    repeat_last_n: number;
    penalize_nl: boolean;
    presence_penalty: number;
    frequency_penalty: number;
    mirostat: number;
    mirostat_tau: number;
    mirostat_eta: number;
    seed: number;
    ignore_eos: boolean;
    cache_prompt: boolean;
  }