import React, { useState } from 'react';
import { chatWithContext } from '../../gpt-bridges/ChatGPTWrapper';
import { useCREP } from '../hooks/useCREP';

interface Message { sender: 'user' | 'ai'; text: string }

export const ChatPanel: React.FC<{ context?: string }> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [backend, setBackend] = useState<'local' | 'external'>('local');
  const { triggerCREP } = useCREP();

  const send = async () => {
    if (!input) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    triggerCREP({ C: 1, R: 1, E: 1, P: 1 });
    let reply: string;
    if (backend === 'local') {
      reply = await chatWithContext(input, context);
    } else {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, context, service: 'external' }),
      });
      reply = await res.text();
    }
    setMessages(m => [...m, { sender: 'ai', text: reply }]);
  };

  return (
    <div>
      <div aria-label="service-toolbar" className="mb-2">
        <button
          aria-label="local-service"
          onClick={() => setBackend('local')}
          disabled={backend === 'local'}
        >
          Local
        </button>
        <button
          aria-label="external-service"
          onClick={() => setBackend('external')}
          disabled={backend === 'external'}
        >
          External
        </button>
      </div>
      <div aria-label="conversation" className="border p-2 h-40 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === 'user' ? 'text-right' : ''}>
            <span>{m.sender === 'user' ? 'You: ' : 'AI: '}{m.text}</span>
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        aria-label="chat-input"
      />
      <button onClick={send}>Send</button>
    </div>
  );
};

export default ChatPanel;
