import React from 'react';
import ChatView from '../components/ChatView';
import type { Message } from '../types';

interface ChatBotPageProps {
  persona: string;
  messages: Message[];
  isLoading: boolean;
  prompt: string;
  onPromptChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPromptSubmit: (e: React.FormEvent) => void;
  onCreateNewBot: () => void;
  onToggleBotList: () => void;
  showBotList: boolean;
}

const ChatBotPage: React.FC<ChatBotPageProps> = ({
  persona,
  messages,
  isLoading,
  prompt,
  onPromptChange,
  onPromptSubmit,
  onCreateNewBot,
  onToggleBotList,
  showBotList,
}) => (
  <>
    <button
      onClick={onToggleBotList}
      className="mb-4 px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors">
      {'Back to Bot List'}
    </button>
    <ChatView
      persona={persona}
      messages={messages}
      isLoading={isLoading}
      prompt={prompt}
      onPromptChange={onPromptChange}
      onPromptSubmit={onPromptSubmit}
      onCreateNewBot={onCreateNewBot}
    />
  </>
);

export default ChatBotPage;