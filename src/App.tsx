import { useState } from 'react';

function App() {
  const [persona, setPersona] = useState('');
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState<{ persona: string; prompt: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted({ persona, prompt });
  };

  return (
    <div className="max-w-[480px] mx-auto my-10 p-6 bg-white rounded-xl shadow-[0_2px_16px_#0001]">
      <h2 className="text-center text-2xl font-bold mb-6">Persona Prompt Builder</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-medium" htmlFor="persona"> Persona: </label>
        <input
          id='persona'
          type="text"
          value={persona}
          onChange={e => setPersona(e.target.value)}
          placeholder="e.g. Friendly AI assistant"
          className="w-full mt-1 p-2 border border-gray-300 rounded-md"
          required />
        <label className="font-medium" htmlFor='prompt'> Prompt: </label>
        <textarea
          id='prompt'
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your prompt here..."
          rows={4}
          className="w-full mt-1 p-2 border border-gray-300 rounded-md resize-y"
          required />
        <button
          type="submit"
          className="py-2.5 rounded-md bg-[#646cff] text-white font-semibold text-base cursor-pointer border-none hover:bg-[#535bf2] transition-colors">
          Submit
        </button>
      </form>
      {submitted && (
        <div className="mt-8 bg-gray-50 rounded-lg p-4 space-y-2">
          <h3 className="text-lg font-semibold">Submitted</h3>
          <div>
            <strong className="font-semibold">Persona:</strong> {submitted.persona}
          </div>
          <div>
            <strong className="font-semibold">Prompt:</strong> {submitted.prompt}
          </div>
        </div>
      )}
    </div>
  );
}

export default App
