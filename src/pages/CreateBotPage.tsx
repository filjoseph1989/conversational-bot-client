import React from 'react';
import Persona from '../components/Persona';

interface CreateBotPageProps {
  name: string;
  persona: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPersonaChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCreateBot: () => void;
  isCreateDisabled: boolean;
}

const CreateBotPage: React.FC<CreateBotPageProps> = ({ name, persona, onNameChange, onPersonaChange, onCreateBot, isCreateDisabled }) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-center text-2xl font-bold mb-6">Create Your Bot</h2>
    <Persona
      name={name}
      onNameChange={onNameChange}
      value={persona}
      onChange={onPersonaChange}
    />
    <button
      onClick={onCreateBot}
      disabled={isCreateDisabled}
      className="py-2.5 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
      Create Bot
    </button>
  </div>
);

export default CreateBotPage;