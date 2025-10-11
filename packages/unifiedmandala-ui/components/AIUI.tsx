import React, { useState } from 'react';

export interface Message {
  agent: string;
  text: string;
}

const agents = ['Codex', 'Evolver', 'Mistral'];

const AIUI: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [agent, setAgent] = useState(agents[0]);

  const send = () => {
    if (!text) return;
    setMessages([...messages, { agent, text }]);
    setText('');
  };

  return (
    <div>
      <select aria-label="agent" value={agent} onChange={(e) => setAgent(e.target.value)}>
        {agents.map((a) => (
          <option key={a} value={a}>
            {a}
          </option>
        ))}
      </select>
      <input aria-label="message" value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={send}>Send</button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>
            {m.agent}: {m.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIUI;
