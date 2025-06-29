// Define the steps for the multi-step form
export type Step = 'CREATE_PERSONA' | 'PERSONA_CREATED' | 'CHATTING';

// Define the message structure
export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
}

// Add Bot interface
export interface Bot {
  persona: string;
  createdAt: number;
}