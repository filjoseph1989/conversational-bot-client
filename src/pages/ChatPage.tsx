import { useParams, useOutletContext } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { AppContextType } from '../App';
import type { Bot } from '../types';
import ChatView from '../components/ChatView';

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
      <ChatView
        onPromptChange={(e) => setPromptValue(e.target.value)}
        onPromptSubmit={handlePromptSubmit}
        botName={bot?.name || ''}
        persona={bot?.persona || ''}
        messages={messages}
        isLoading={isLoading}
        prompt={promptValue}
        chatContainerRef={chatContainerRef}
      />
    </>
  );
}

export default ChatPage;