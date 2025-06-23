import React, { useState } from 'react';
import { chatWithContext } from '../../gpt-bridges/ChatGPTWrapper';
import { useCREP } from '../hooks/useCREP';

interface Message { sender: 'user' | 'ai'; text: string }

export const ChatPanel: React.FC<{ context?: string }> = ({ context }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { triggerCREP } = useCREP();

  const send = async () => {
    if (!input) return;
    const userMsg: Message = { sender: 'user', text: input };
    setMessages(m => [...m, userMsg]);
    setInput('');
    triggerCREP({ C: 1, R: 1, E: 1, P: 1 });
    const reply = await chatWithContext(input, context);
    setMessages(m => [...m, { sender: 'ai', text: reply }]);
  };

  return (
    <div>
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
