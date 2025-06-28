
import { useState } from 'react';
import './App.css';

function App() {
  const [persona, setPersona] = useState('');
  const [prompt, setPrompt] = useState('');
  const [submitted, setSubmitted] = useState<{ persona: string; prompt: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted({ persona, prompt });
  };

  return (
    <div className="app-container" style={{ maxWidth: 480, margin: '40px auto', padding: 24, borderRadius: 12, boxShadow: '0 2px 16px #0001', background: '#fff' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Persona Prompt Builder</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <label style={{ fontWeight: 500 }}>
          Persona:
          <input
            type="text"
            value={persona}
            onChange={e => setPersona(e.target.value)}
            placeholder="e.g. Friendly AI assistant"
            style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
            required
          />
        </label>
        <label style={{ fontWeight: 500 }}>
          Prompt:
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={4}
            style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 6, border: '1px solid #ccc', resize: 'vertical' }}
            required
          />
        </label>
        <button type="submit" style={{ padding: '10px 0', borderRadius: 6, background: '#646cff', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, cursor: 'pointer' }}>
          Submit
        </button>
      </form>
      {submitted && (
        <div style={{ marginTop: 32, background: '#f6f8fa', borderRadius: 8, padding: 16 }}>
          <h3>Submitted</h3>
          <div><strong>Persona:</strong> {submitted.persona}</div>
          <div><strong>Prompt:</strong> {submitted.prompt}</div>
        </div>
      )}
    </div>
  );
}

export default App
