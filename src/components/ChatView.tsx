import React from 'react';
import Prompt from './Prompt';
import type { Message } from '../types/index';

interface ChatViewProps {
  persona: string;
  messages: Message[];
  isLoading: boolean;
  prompt: string;
  onPromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onPromptSubmit: (e: React.FormEvent) => void;
  onCreateNewBot: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({
  persona,
  messages,
  isLoading,
  prompt,
  onPromptChange,
  onPromptSubmit,
  onCreateNewBot,
}) => {
  return (
    <>
      <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md flex justify-between items-center">
        <p><strong className="font-semibold">Bot Persona:</strong> {persona}</p>
        <button
          onClick={onCreateNewBot}
          className="py-1 px-3 rounded-md bg-white text-blue-600 border border-blue-300 hover:bg-blue-100 transition-colors text-sm font-semibold">
          New Bot
        </button>
      </div>

      <div className="space-y-4 mb-4 h-80 overflow-y-auto p-3 border rounded-md bg-gray-50 flex flex-col">
        {messages.map((message) => (
          <div key={message.id} className={`flex items-end ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              <p className="text-sm">{message.text}</p>
              {message.audioUrl && (
                <audio controls src={message.audioUrl} className="mt-2 w-full h-8" />
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

      <form onSubmit={onPromptSubmit} className="flex flex-col gap-4">
        <Prompt value={prompt} onChange={onPromptChange} />
        <button type="submit" disabled={isLoading || !prompt.trim()} className="py-2.5 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
          {isLoading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </>
  );
};

export default ChatView;