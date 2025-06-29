import React from 'react';

interface PersonaProps {
  name: string;
  value: string;
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Persona: React.FC<PersonaProps> = ({ name, value, onNameChange, onChange }) => {
  return (
    <>
      <label className="font-medium" htmlFor="bot-name">Name:</label>
      <input
        id="bot-name"
        type="text"
        value={name}
        onChange={onNameChange}
        placeholder="e.g. Luna"
        className="w-full mt-1 p-2 border border-gray-300 rounded-md"
        required />
      <label className="font-medium mt-2" htmlFor="persona">Role:</label>
      <textarea
        id='persona'
        value={value}
        onChange={onChange}
        placeholder="e.g. Friendly AI assistant"
        className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-y min-h-[60px]"
        required />
    </>
  );
};

export default Persona;