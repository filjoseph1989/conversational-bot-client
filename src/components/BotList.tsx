import type { Bot } from '../types';
import { capitalize, truncateWords } from '../utils/stringUtils';
import ChatIcon from '../assets/chat-svgrepo-com.svg';
import { Link } from 'react-router-dom';

interface BotListProps {
  bots: Bot[];
  onDeleteBot: (botId: string) => void;
}

const BotList = ({ bots, onDeleteBot }: BotListProps) => {
  return (
    <ul className="space-y-1">
      {bots.map((bot) => (
        <li key={bot.id} className="flex items-center gap-2 text-sm justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">{capitalize(bot.name)}</span>
            <span className="text-gray-600 cursor-help" title={bot.persona}>
              - {truncateWords(bot.persona, 3)}
            </span>
            <span className="text-gray-400">({new Date(bot.createdAt).toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/chat/${bot.id}`}
              className="p-1 rounded-full hover:bg-[#e3e5ff] transition-colors cursor-pointer flex items-center justify-center"
              title="Start Chatting" >
              <img src={ChatIcon} alt="Chat" className="w-5 h-5" />
            </Link>
            <button
              onClick={() => onDeleteBot(bot.id)}
              className="p-1 rounded-full hover:bg-red-100 transition-colors cursor-pointer flex items-center justify-center"
              title="Delete Bot" >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BotList;