import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import type { Bot } from './types';

export type AppContextType = {
  bots: Bot[];
  setBots: React.Dispatch<React.SetStateAction<Bot[]>>
};

function App() {
  const [bots, setBots] = useState<Bot[]>(() => {
    const saved = localStorage.getItem('bots');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('bots', JSON.stringify(bots));
  }, [bots]);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <nav className="max-w-4xl mx-auto p-4">
          <Link to="/" className="text-xl font-bold text-gray-800 hover:text-[#646cff] transition-colors">
            AI Bot Builder
          </Link>
        </nav>
      </header>
      <main>
        <Outlet context={{ bots, setBots }} />
      </main>
    </>
  );
}

export default App;
