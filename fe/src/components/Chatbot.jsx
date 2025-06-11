// ChatbotScreen.js
import React, { useState, useEffect } from 'react';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';
import Cookies from 'js-cookie';
import axios from 'axios';

function ChatbotScreen() { 
  const userId = Cookies.get('userId');
  const [conversations, setConversations] = useState([]);
  const [conversationTitles, setConversationTitles] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  useEffect(() => {
    fetchConversations();
  }, [userId]);

  // Function to fetch conversations
  const fetchConversations = async () => {
    if (userId) {
      try {
        const response = await axios.get(
          `http://localhost:5002/chatbot/conversation_list/${userId}`
        );

        // Convert the response data into the desired format
        const temp = [];
        const tempTitles = [];
        for (let i = 0; i < response.data.length; i++) {
          temp.push({ id: response.data[i] });
          tempTitles.push(`Conversation ${i + 1}`);
        }
        temp.reverse();
        tempTitles.reverse();
        setConversations(temp);
        setConversationTitles(tempTitles);
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    } else {
      // User ID does not exist, fetch announcements
      try {
        const response = await axios.get('http://localhost:5002/chatbot/announcements');
        setConversations(response.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      }
    }
  };

  // Function to create a new conversation
  const handleCreateNewConversation = async () => {
    if (userId) {
      try {
        const response = await axios.post(
          `http://localhost:5002/chatbot/create/${userId}`
        );

        // Assuming the response contains the new conversation ID
        const newConversationId = response.data;

        // Refresh the conversation list
        fetchConversations();

        // Optionally, select the newly created conversation
        setSelectedConversationId(newConversationId);
      } catch (error) {
        console.error('Error creating new conversation:', error);
      }
    } else {
      console.error('User ID is not available.');
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <ConversationList
        conversations={conversations}
        conversationTitles={conversationTitles}
        selectedConversationId={selectedConversationId}
        onSelectConversation={setSelectedConversationId}
        onCreateNewConversation={handleCreateNewConversation}
      />
      {selectedConversationId ? (
        <ChatWindow conversationId={selectedConversationId} />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}

export default ChatbotScreen;
