// web/src/components/Chatbot.jsx
import React, { useState, useRef, useEffect } from 'react';
import { getChatResponse } from '../../../shared/services/chatbotService';
import { PRIESTS_SEED } from '../../../shared/data/seedData';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Namaste! 🙏 I\'m your PoojaConnect assistant. Ask me about poojas, homams, priests, vendors, or Hindu rituals.' }
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { from: 'user', text: userMsg }]);
    setInput('');
    setTimeout(() => {
      const response = getChatResponse(userMsg, { priestCount: 12, vendorCount: 5, priests: PRIESTS_SEED });
      setMessages(m => [...m, { from: 'bot', text: response }]);
    }, 500);
  };

  return (
    <>
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full text-white shadow-xl z-50 flex items-center justify-center text-2xl transition-transform hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #E8712A, #C5561A)' }}>
        {open ? '✕' : '💬'}
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 w-96 max-w-[calc(100vw-40px)] h-[480px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
          <div className="text-white px-5 py-3" style={{ background: 'linear-gradient(135deg, #E8712A, #C5561A)' }}>
            <div className="font-bold text-sm">🙏 PoojaConnect Assistant</div>
            <div className="text-xs opacity-80">Ask about poojas, priests, or rituals</div>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
                m.from === 'user'
                  ? 'self-end rounded-t-xl rounded-bl-xl text-white'
                  : 'self-start rounded-t-xl rounded-br-xl'
              }`} style={{
                background: m.from === 'user' ? '#E8712A' : '#FFF3EB',
                color: m.from === 'user' ? '#fff' : '#1A1207'
              }}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="p-3 border-t border-gray-100 flex gap-2">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about poojas, priests..."
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-orange-400" />
            <button onClick={handleSend}
              className="w-9 h-9 rounded-lg text-white flex items-center justify-center text-sm"
              style={{ background: '#E8712A' }}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
