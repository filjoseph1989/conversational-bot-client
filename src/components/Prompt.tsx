import React from 'react';

interface PromptProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const Prompt: React.FC<PromptProps> = ({ value, onChange }) => {
  return (
    <>
      <label className="font-medium" htmlFor='prompt'> Prompt: </label>
      <textarea
        id='prompt'
        value={value}
        onChange={onChange}
        placeholder="Enter your prompt here..."
        rows={4}
        className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-y"
        required />
    </>
  );
};

export default Prompt;