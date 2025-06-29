export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
}

export interface Bot {
  id: string;
  name: string;
  persona: string;
  createdAt: string; // ISO 8601 format
  messages: Message[];
}

export interface StatusMessage {
  type: 'success' | 'error';
  message: string;
}