// Define the steps for the multi-step form
export type Step = 'CREATE_PERSONA' | 'PERSONA_CREATED' | 'CHATTING';

// Define the message structure
export interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
}