import React from 'react';
import BotList from '../components/BotList';
import type { Bot } from '../types';

interface BotListPageProps {
  bots: Bot[];
  onStartChat: (persona: string, name: string, createdAt?: number) => void;
  onCreateNewBot: () => void;
}

const BotListPage: React.FC<BotListPageProps> = ({ bots, onStartChat, onCreateNewBot }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-center text-2xl font-bold mb-6">Your Bots</h2>
    <BotList bots={bots} onStartChat={onStartChat} />
    <button
      onClick={onCreateNewBot}
      className="py-2.5 px-6 rounded-md bg-white text-[#646cff] font-semibold text-base cursor-pointer border border-[#646cff] hover:bg-blue-50 transition-colors mt-4">
      Create New Bot
    </button>
  </div>
);

export default BotListPage;