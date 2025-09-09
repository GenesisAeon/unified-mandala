import React, { useState } from 'react';
import ServiceToolbar from './ServiceToolbar';

interface Message { sender: 'user' | 'ai'; text: string }

export const ChatPanel: React.FC<{ context?: string }> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [service, setService] = useState('gpt4all_chat');

  const send = async () => {
    if (!input) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    const res = await fetch('http://localhost:7070/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, context, service })
    }).then(r => r.json());
    setMessages(m => [...m, { sender: 'ai', text: `${res.output} (CREP:${res.crep})` }]);
  };

  return (
    <div>
      <ServiceToolbar onPick={setService} />
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
        onKeyDown={e => {
          if (e.key === 'Enter') {
            send();
          }
        }}
      />
      <button onClick={send}>Send</button>
    </div>
  );
};

export default ChatPanel;
