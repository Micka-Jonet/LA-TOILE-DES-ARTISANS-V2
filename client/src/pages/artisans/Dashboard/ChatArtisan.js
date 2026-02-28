import React, { useState, useEffect, useRef } from 'react';
import './ChatArtisan.scss';

const ChatArtisan = ({ clientName = "Client Externe", jobTitle = "Rénovation Électrique" }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'system', text: 'La mise en relation est établie. Le client utilise un lien temporaire.' },
    { id: 2, sender: 'client', text: 'Bonjour, j\'ai vu que vous étiez disponible. Serait-il possible d\'avoir un devis ?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  // Auto-scroll vers le bas à chaque message
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'artisan',
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <div className="user-info">
          <div className="status-indicator online"></div>
          <div>
            <h4>{clientName}</h4>
            <p>{jobTitle}</p>
          </div>
        </div>
        <div className="chat-actions">
          <button className="btn-icon">📞</button>
          <button className="btn-icon">📁</button>
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
            <div className="message-bubble">
              <p>{msg.text}</p>
              {msg.time && <span className="message-time">{msg.time}</span>}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Écrivez votre message ici..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-send" disabled={!input.trim()}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ChatArtisan;