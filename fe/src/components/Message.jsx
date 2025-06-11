import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '../styles/markdown.css';

function Message({ message }) {
  const isUser = message.sender === 'user';
  return (
    <div
      className={`mb-2 flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-md p-3 rounded ${
          isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
        } markdown-table-container`}
      >
        {isUser ? (
          message.text
        ) : (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            className="markdown-content"
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}

export default Message;
