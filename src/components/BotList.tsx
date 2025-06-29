import type { Bot } from '../types';
import { capitalize, truncateWords } from '../utils/stringUtils';
import ChatIcon from '../assets/chat-svgrepo-com.svg';

interface BotListProps {
  bots: Bot[];
  onStartChat: (persona: string, name: string, createdAt: number) => void;
}

const BotList = ({ bots, onStartChat }: BotListProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">All Bots</h3>
      <ul className="space-y-1">
        {bots.map((bot) => (
          <li key={bot.createdAt} className="flex items-center gap-2 text-sm justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold">{capitalize(bot.name)}</span>
              <span className="text-gray-600 cursor-help" title={bot.persona}>
                - {truncateWords(bot.persona, 3)}
              </span>
              <span className="text-gray-400">({new Date(bot.createdAt).toLocaleString()})</span>
            </div>
            <button
              onClick={() => onStartChat(bot.persona, bot.name, bot.createdAt)}
              className="p-1 rounded-full text-white hover:bg-[#e3e5ff] transition-colors cursor-pointer flex items-center justify-center"
              title="Start Chatting" >
              <img src={ChatIcon} alt="Chat" className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BotList;