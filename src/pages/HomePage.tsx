import { useEffect, useState } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import { capitalize, truncateWords } from '../utils/stringUtils';
import ChatIcon from '../assets/chat-svgrepo-com.svg';

import type { AppContextType } from '../App';
import type { StatusMessage } from '../types';

function HomePage() {
  const { bots, setBots } = useOutletContext<AppContextType>();
  const location = useLocation();
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  useEffect(() => {
    if (location.state?.statusMessage) {
      setStatusMessage(location.state.statusMessage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (statusMessage) {
      const timer = setTimeout(() => {
        setStatusMessage(null);
      }, 5000); // Hide after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const handleDeleteBot = (botId: string) => {
    if (window.confirm('Are you sure you want to delete this bot? This action cannot be undone.')) {
      setBots((prevBots) => prevBots.filter((bot) => bot.id !== botId));
      setStatusMessage({ type: 'success', message: 'Bot deleted successfully.' });
    }
  };

  return (
    <>
      <div className="max-w-[480px] mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_2px_16px_#0001]">
        <div className="text-center flex flex-col gap-4 items-center">
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-center text-2xl font-bold mb-6">Your Bots</h2>
            {statusMessage && (
              <div
                className={`p-3 mb-4 rounded-md text-sm ${
                  statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`} >
                {statusMessage.message}
              </div>
            )}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">All Bots</h3>
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
                        onClick={() => handleDeleteBot(bot.id)}
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
            </div>
            <Link
              to="/new-bot"
              className="py-2.5 px-6 rounded-md bg-white text-[#646cff] font-semibold text-base cursor-pointer border border-[#646cff] hover:bg-blue-50 transition-colors mt-4" >
              Create New Bot
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;