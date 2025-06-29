import { useState } from 'react';
import Persona from './components/Persona';
import ChatView from './components/ChatView';

// Define the steps for the multi-step form
type Step = 'CREATE_PERSONA' | 'PERSONA_CREATED' | 'CHATTING';

// Define the message structure
export interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  audioUrl?: string;
}

function App() {
  const [step, setStep] = useState<Step>('CREATE_PERSONA');
  const [persona, setPersona] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === '' || isLoading) return;

    setStatusMessage(null);

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: prompt,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt(''); // Clear prompt immediately for better UX
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ persona, prompt: currentPrompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const data = await response.json(); // { text: string, audioContent: string }

      if (!data.text || !data.audioContent) {
        throw new Error('Invalid response from server.');
      }

      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;

      const botMessage: Message = {
        id: Date.now() + 1, // ensure unique key
        sender: 'bot',
        text: data.text,
        audioUrl: audioUrl,
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatusMessage({ type: 'error', message: `Failed to get response: ${errorMessage}` });
      console.error('Error submitting form:', error);
      setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      setPrompt(currentPrompt);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * handleCreateBot - Handles the creation of the bot persona.
   * @returns void
   */
  const handleCreateBot = () => {
    if (persona.trim() === '') {
      setStatusMessage({ type: 'error', message: 'Persona cannot be empty.' });
      return;
    }
    setStatusMessage({ type: 'success', message: 'Bot successfully created!' });
    setStep('PERSONA_CREATED');
  };

  /**
   * handleStartChatting - Transitions to the chatting step.
   * @returns void
   */
  const handleStartChatting = () => {
    setStep('CHATTING');
    setStatusMessage(null); // Clear the "Bot created" message
  };

  return (
    <div className="max-w-[480px] mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_2px_16px_#0001]">
      <h2 className="text-center text-2xl font-bold mb-6">
        {step === 'CREATE_PERSONA' ? 'Create Your Bot' : 'Chat with your Bot'}
      </h2>

      {step === 'CREATE_PERSONA' && (
        <div className="flex flex-col gap-4">
          <Persona value={persona} onChange={e => setPersona(e.target.value)} />
          <button
            onClick={handleCreateBot}
            disabled={!persona.trim()}
            className="py-2.5 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            Create Bot
          </button>
        </div>
      )}

      {step === 'PERSONA_CREATED' && (
        <div className="text-center">
          <button
            onClick={handleStartChatting}
            className="py-2.5 px-6 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors">
            Start Chatting
          </button>
        </div>
      )}

      {step === 'CHATTING' && (
        <ChatView
          persona={persona}
          messages={messages}
          isLoading={isLoading}
          prompt={prompt}
          onPromptChange={e => setPrompt(e.target.value)}
          onPromptSubmit={handlePromptSubmit} />
      )}

      {statusMessage && (
        <div className={`mt-4 p-3 rounded-md text-center ${statusMessage.type === 'success'
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
        }`}>{statusMessage.message}</div>
      )}
    </div>
  );
}

export default App
