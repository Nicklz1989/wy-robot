export interface KnowledgeItem {
  id: string;
  category: string;
  title: string;
  content: string;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface OperationLog {
  id: string;
  action: string;
  details: Record<string, unknown> | null;
  operator: string | null;
  created_at: string;
}

export interface Admin {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface ChatRequest {
  message: string;
  history?: Message[];
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface KnowledgeCreateRequest {
  category: string;
  title: string;
  content: string;
}

export interface KnowledgeUpdateRequest {
  id: string;
  category?: string;
  title?: string;
  content?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  error?: string;
}
