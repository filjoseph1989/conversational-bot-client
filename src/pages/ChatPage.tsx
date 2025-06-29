import { Link, useParams, useOutletContext } from 'react-router-dom';
import { truncateWords } from '../utils/stringUtils';
import { useEffect, useRef, useState } from 'react';
import type { AppContextType } from '../App';
import type { Bot } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  audioUrl?: string;
}

function ChatPage() {
  const { botId } = useParams<{ botId: string }>();
  const { bots, setBots } = useOutletContext<AppContextType>();
  const [bot, setBot] = useState<Bot | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promptValue, setPromptValue] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentBot = bots.find((b) => b.id === botId);
    if (currentBot) {
      setBot(currentBot);
      // Ensure messages is always an array
      setMessages(currentBot.messages || []);
    }
  }, [botId, bots]);

  useEffect(() => {
    // Auto-scroll to the bottom of the chat
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptValue.trim() || !bot) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: promptValue,
      sender: 'user',
    };

    // Optimistically update UI with user's message
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setPromptValue('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: promptValue,
          persona: bot.persona,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: { text: string; audioContent: string } = await response.json();

      if (!data.text || !data.audioContent) {
        throw new Error('Invalid response from server.');
      }

      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: data.text,
        sender: 'bot',
        audioUrl: audioUrl,
      };

      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      // Persist conversation to the global state
      setBots((prevBots) => prevBots.map((b) => (b.id === botId ? { ...b, messages: finalMessages } : b)));
    } catch (error) {
      console.error('Failed to fetch bot response:', error);
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "Sorry, I couldn't get a response. Please try again.",
        sender: 'bot',
      };
      const finalMessages = [...updatedMessages, errorMessage];
      // Show error message in the chat UI and persist the conversation
      setMessages(finalMessages);
      setBots((prevBots) => prevBots.map((b) => (b.id === botId ? { ...b, messages: finalMessages } : b)));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-[480px] mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_2px_16px_#0001]">
        <div className="text-center flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-bold">{bot?.name}</h2>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center w-full">
            <p className="text-sm text-left">
              <strong className="font-semibold">Role:</strong>{' '}
              <span title={bot?.persona}>{truncateWords(bot?.persona || '', 10)}</span>
            </p>
            <Link
              to="/"
              className="py-1 px-3 rounded-md bg-white text-blue-600 border border-blue-300 hover:bg-blue-100 transition-colors text-sm font-semibold cursor-pointer hover:shadow-sm">
              Back
            </Link>
          </div>

          <div ref={chatContainerRef} className="w-full space-y-4 mb-4 h-80 overflow-y-auto p-3 border rounded-md bg-gray-50 flex flex-col">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
                  <p className="text-sm">{message.text}</p>
                  {message.audioUrl && (
                    <audio controls autoPlay src={message.audioUrl} className="mt-2 w-full h-8" />
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-black">
                  <p className="text-sm italic">Bot is thinking...</p>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handlePromptSubmit} className="w-full flex flex-col gap-4">
            <label className="font-medium" htmlFor='prompt'> Prompt: </label>
            <textarea
              id='prompt'
              value={promptValue}
              onChange={(e) => setPromptValue(e.target.value)}
              placeholder="Enter your prompt here..."
              rows={4}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-y"
              required />
            <button
              type="submit"
              disabled={isLoading || !promptValue.trim()}
              className="py-2.5 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChatPage;