import { useState, useEffect } from 'react';
import Persona from './components/Persona';
import ChatView from './components/ChatView';
import type { Step, Message, Bot } from './types/index';

function App() {
  const [step, setStep] = useState<Step>('CREATE_PERSONA');
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [bots, setBots] = useState<Bot[]>([]);

  // Automatically hide statusMessage after 3 seconds
  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  /**
   * Handle prompt submission.
   *
   * @param e
   * @returns
   */
  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === '' || isLoading) return;

    setStatusMessage(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
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
        id: crypto.randomUUID(),
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
    if (name.trim() === '') {
      setStatusMessage({ type: 'error', message: 'Bot name cannot be empty.' });
      return;
    }
    if (persona.trim() === '') {
      setStatusMessage({ type: 'error', message: 'Persona cannot be empty.' });
      return;
    }
    // Add the new bot to the bots list
    setBots(prev => [
      ...prev,
      { name: name.trim(), persona: persona.trim(), createdAt: Date.now() }
    ]);
    setStatusMessage({ type: 'success', message: 'Bot successfully created!' });
    setStep('PERSONA_CREATED');
  };

  /**
   * handleStartChatting - Transitions to the chatting step.
   * @returns void
   */
  const handleStartChatting = (persona: string, name: string): void => {
    setPersona(persona);
    setName(name);
    setStep('CHATTING');
    setStatusMessage(null); // Clear the "Bot created" message
  };

  /**
   * handleCreateNewBot - Resets the application state to allow creating a new bot.
   * @returns void
   */
  const handleCreateNewBot = () => {
    setStep('CREATE_PERSONA');
    setName('');
    setPersona('');
    setMessages([]);
    setPrompt('');
    setIsLoading(false);
    setStatusMessage(null);
  };

  return (
    <div className="max-w-[480px] mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_2px_16px_#0001]">
      <h2 className="text-center text-2xl font-bold mb-6">
        {step === 'CREATE_PERSONA' ? 'Create Your Bot' : 'Chat with your Bot'}
      </h2>

      {/* List of all created bots */}
      {bots.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">All Bots</h3>
          <ul className="space-y-1">
            {bots.map((bot) => (
              <li key={bot.createdAt} className="flex items-center gap-2 text-sm justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{bot.name}</span>
                  <span
                    className="text-gray-600 cursor-help cursor-pointer"
                    title={bot.persona}>
                    - {bot.persona.split(' ').slice(0, 3).join(' ')}{bot.persona.split(' ').length > 3 ? '...' : ''}
                  </span>
                  <span className="text-gray-400">({new Date(bot.createdAt).toLocaleString()})</span>
                </div>
                <button
                  onClick={() => handleStartChatting(bot.persona, bot.name)}
                  className="p-1 rounded-full text-white hover:bg-[#e3e5ff] transition-colors cursor-pointer flex items-center justify-center"
                  title="Start Chatting" >
                  <img src="src/assets/chat-svgrepo-com.svg" alt="Chat" className="w-5 h-5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {step === 'CREATE_PERSONA' && (
        <div className="flex flex-col gap-4">
          <Persona
            name={name}
            onNameChange={e => setName(e.target.value)}
            value={persona}
            onChange={e => setPersona(e.target.value)} />
          <button
            onClick={handleCreateBot}
            disabled={!name.trim() || !persona.trim()}
            className="py-2.5 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
            Create Bot
          </button>
        </div>
      )}

      {step === 'PERSONA_CREATED' && (
        <div className="text-center flex flex-col gap-4 items-center">
          <button
            onClick={handleCreateNewBot}
            className="py-2.5 px-6 rounded-md bg-white text-[#646cff] font-semibold text-base cursor-pointer border border-[#646cff] hover:bg-blue-50 transition-colors">
            Create New Bot
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
          onPromptSubmit={handlePromptSubmit}
          onCreateNewBot={handleCreateNewBot} />
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
