import { useState, useEffect } from 'react';

import type { Step, Message, Bot } from './types/index';
import BotListPage from './pages/BotListPage';
import CreateBotPage from './pages/CreateBotPage';
import ChatBotPage from './pages/ChatBotPage';

function App() {
  const [showBotList, setShowBotList] = useState(true);
  const [step, setStep] = useState<Step>('CREATE_PERSONA');
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [prompt, setPrompt] = useState('');
  const [selectedBotId, setSelectedBotId] = useState<number | null>(null);
  const [bots, setBots] = useState<Bot[]>(() => {
    const saved = localStorage.getItem('bots');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Persist bots (with messages) to localStorage
  useEffect(() => {
    localStorage.setItem('bots', JSON.stringify(bots));
  }, [bots]);

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
    if (prompt.trim() === '' || isLoading || selectedBotId === null) return;

    setStatusMessage(null);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      sender: 'user',
      text: prompt,
    };

    const currentPrompt = prompt;
    setPrompt(''); // Clear prompt immediately for better UX
    setIsLoading(true);

    setBots(prevBots => prevBots.map(bot =>
      bot.createdAt === selectedBotId
        ? { ...bot, messages: [...(bot.messages || []), userMessage] }
        : bot
    ));

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

      setBots(prevBots => prevBots.map(bot =>
        bot.createdAt === selectedBotId
          ? { ...bot, messages: [...(bot.messages || []), botMessage] }
          : bot
      ));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setStatusMessage({ type: 'error', message: `Failed to get response: ${errorMessage}` });
      console.error('Error submitting form:', error);
      setBots(prevBots => prevBots.map(bot =>
        bot.createdAt === selectedBotId
          ? { ...bot, messages: (bot.messages || []).filter(m => m.id !== userMessage.id) }
          : bot
      ));
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
    const newBot: Bot = {
      name: name.trim(),
      persona: persona.trim(),
      createdAt: Date.now(),
      messages: [],
    };
    setBots(prev => [...prev, newBot]);
    setSelectedBotId(newBot.createdAt);
    setStatusMessage({ type: 'success', message: 'Bot successfully created!' });
    setStep('PERSONA_CREATED');
  };

  /**
   * handleStartChatting - Transitions to the chatting step.
   * @returns void
   */
  const handleStartChatting = (persona: string, name: string, createdAt?: number): void => {
    setPersona(persona);
    setName(name);
    if (createdAt) setSelectedBotId(createdAt);
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
    setSelectedBotId(null);
    setPrompt('');
    setStep('CREATE_PERSONA');
    setName('');
    setPersona('');
    setSelectedBotId(null);
    setPrompt('');
    setIsLoading(false);
    setStatusMessage(null);
  };

  return (
    <div className="max-w-[480px] mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_2px_16px_#0001]">
      {step === 'CREATE_PERSONA' && (
        <CreateBotPage
          name={name}
          persona={persona}
          onNameChange={e => setName(e.target.value)}
          onPersonaChange={e => setPersona(e.target.value)}
          onCreateBot={handleCreateBot}
          isCreateDisabled={!name.trim() || !persona.trim()}
        />
      )}

      {step === 'PERSONA_CREATED' && (
        <div className="text-center flex flex-col gap-4 items-center">
          <button
            onClick={handleCreateNewBot}
            className="py-2.5 px-6 rounded-md bg-white text-[#646cff] font-semibold text-base cursor-pointer border border-[#646cff] hover:bg-blue-50 transition-colors">
            Create New Bot
          </button>
          <BotListPage
            bots={bots}
            onStartChat={handleStartChatting}
            onCreateNewBot={handleCreateNewBot}
          />
        </div>
      )}

      {step === 'CHATTING' && selectedBotId !== null && (
        <ChatBotPage
          persona={persona}
          messages={bots.find(b => b.createdAt === selectedBotId)?.messages || []}
          isLoading={isLoading}
          prompt={prompt}
          onPromptChange={e => setPrompt(e.target.value)}
          onPromptSubmit={handlePromptSubmit}
          onCreateNewBot={handleCreateNewBot}
          onToggleBotList={() => setShowBotList((prev) => !prev)}
          showBotList={showBotList}
        />
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
