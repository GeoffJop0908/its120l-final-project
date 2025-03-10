import React, { useState } from 'react';
import axios from 'axios';
import useChatStore from '../store/chatStore';

export default function Chat() {
  const [input, setInput] = useState('');
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      addMessage({ content: input, user: 'Human' });

      axios
        .post('http://localhost:5000/chat', { prompt: input })
        .then((res) => {
          console.log(res.data);
          addMessage({ content: res.data, user: 'AI' });
        })
        .catch((error) => {
          console.error('Error fetching recommendations:', error);
        });

      setInput('');
    }
  };

  return (
    <div className="bg-neutral-800 h-[100vh] flex items-center justify-center text-white gap-5 flex-col">
      <div className="overflow-auto h-[80%]">
        <ul className="list bg-base-100 rounded-box shadow-md w-80">
          <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Chat</li>
        </ul>
        <div className="bg-none">
          {messages.map((message, i) => (
            <div
              className={`chat ${
                message.user == 'Human' ? 'chat-end' : 'chat-start'
              }`}
              key={i}
            >
              <div className="chat-bubble chat-bubble-info">
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <form className="flex gap-5">
        <input
          type="text"
          placeholder="Type here"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)} // Update state on input
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button
          type="submit"
          className="btn btn-success"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </form>
    </div>
  );
}
