import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import type { AppContextType } from '../App';
import type { Bot, StatusMessage } from '../types/index';
import Persona from '../components/Persona';

function NewBotPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [persona, setPersona] = useState('');
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);
  const { setBots } = useOutletContext<AppContextType>();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim() === '') {
      setStatusMessage({ type: 'error', message: 'Bot name cannot be empty.' });
      return;
    }
    if (persona.trim() === '') {
      setStatusMessage({ type: 'error', message: 'Role cannot be empty.' });
      return;
    }

    const newBot: Bot = {
      id: crypto.randomUUID(),
      name: name.trim(),
      persona: persona.trim(),
      createdAt: new Date().toISOString(),
      messages: [],
    };

    setBots((prevBots) => [...prevBots, newBot]);
    navigate('/', { state: { statusMessage: { type: 'success', message: 'Bot successfully created!' } } });
  };

  return (
    <div className="max-w-[480px] mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_2px_16px_#0001]">
      <h2 className="text-center text-2xl font-bold mb-6">Create a New Bot</h2>

      {statusMessage && (
        <div
          className={`p-3 mb-4 rounded-md text-sm ${
            statusMessage.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`} >
          {statusMessage.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Persona
          name={name}
          value={persona}
          onNameChange={(e) => setName(e.target.value)}
          onChange={(e) => setPersona(e.target.value)}
        />
        <button
          type="submit"
          className="py-2.5 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors" >
          Create Bot
        </button>
      </form>
    </div>
  );
}

export default NewBotPage;