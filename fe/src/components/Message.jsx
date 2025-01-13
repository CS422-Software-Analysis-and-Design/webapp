import React from 'react';

function Message({ message }) {
  const isUser = message.sender === 'user';
  return (
    <div
      className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-xs p-2 rounded ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        }`}
      >
        {message.text}
      </div>
    </div>
  );
}

export default Message;
