import { useEffect, useState } from 'react';
import { Link, useLocation, useOutletContext } from 'react-router-dom';
import BotList from '../components/BotList';

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
              <BotList bots={bots} onDeleteBot={handleDeleteBot} />
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