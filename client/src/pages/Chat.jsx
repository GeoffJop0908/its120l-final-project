import React, { useState } from 'react';
import axios from 'axios';
import useChatStore from '../store/chatStore';

export default function Chat() {
  const isLoading = useChatStore((state) => state.isLoading);
  const messages = useChatStore((state) => state.messages);

  return (
    <div className="h-4/5 w-4/5 flex items-center justify-center text-white gap-5 flex-col p-10">
      <h1 className="self-start text-2xl font-extrabold">Chat</h1>
      <div className="overflow-auto h-full w-full flex flex-col">
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
          {isLoading && (
            <div className="chat chat-start">
              <div className="chat-header text-white">
                The AI is thinking...
              </div>
              <div className="chat-bubble chat-bubble-info animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
