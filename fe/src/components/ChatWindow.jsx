import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Message from './Message';

function ChatWindow({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  // Load messages for the selected conversation from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5002/chatbot/${conversationId}/content`
        );
        /** this is the format of response.data
         * [
         *   { content: '...', role: 'system' },
         *   { content: '...', role: 'user' },
         *   { content: '...', role: 'system' },
         * ]
         *
         * Convert it into:
         * {
         *   '1': [
         *     { sender: 'user', text: '...' },
         *     { sender: 'bot', text: '...' },
         *   ],
         * }
         */

        const temp = {};
        for (let i = 1; i < response.data.length; i++) {
          const messageRole = response.data[i].role;
          const messageContent = response.data[i].content;

          if (!temp[conversationId]) {
            temp[conversationId] = [];
          }

          temp[conversationId].push({
            sender: messageRole === 'user' ? 'user' : 'bot',
            text: messageContent,
          });
        }
        // Add a default bot message if the conversation is empty
        if (!temp[conversationId] || temp[conversationId].length === 0) {
          temp[conversationId] = [
            { sender: 'bot', text: 'Hello! How can I assist you today?' },
          ];
        }
        setMessages(temp[conversationId]);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [conversationId]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setInput('');
    // Add the user's message to the messages array to update the UI immediately
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      // Encode the message to be URL-safe
      const encodedMessage = encodeURIComponent(input.trim());

      // Send the message to the backend using the specified endpoint
      const response = await axios.post(
        `http://localhost:5002/chatbot/${conversationId}/send_message/${encodedMessage}`
      );

      const botReply = response.data; // Assuming the response contains the bot's reply
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'bot', text: botReply.response },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
    }

    
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevents new line on Enter
      handleSendMessage();
    }
  };

  const scrollToBottom = () => {
    //messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative flex flex-col flex-1 h-screen">
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-6 mb-40">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area at the bottom */}
      <div className="w-full absolute bottom-20 left-1/2 transform -translate-x-1/2 p-4 bg-white">
        <div className="flex items-center justify-center max-w-2xl mx-auto">
          <textarea
            className="flex-1 p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyPress}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!input.trim()}
            className={`ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded ${
              !input.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;