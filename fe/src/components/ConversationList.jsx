// ConversationList.js
import React from 'react';

function ConversationList({
  conversations,
  conversationTitles,
  selectedConversationId,
  onSelectConversation,
  onCreateNewConversation,
}) {
  return (
    <div className="w-80 bg-gray-100 p-4 flex flex-col mb-16">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Conversations</h2>
        <button
          onClick={onCreateNewConversation}
          className="bg-blue-500 font-semibold text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
        >
          + New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation, index) => (
          <div
            key={conversation.id}
            className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer ${
              selectedConversationId === conversation.id
                ? 'bg-gray-200'
                : 'hover:bg-gray-200'
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            {/* Icon */}
            <div className="w-6 h-6 mr-3 text-gray-600">
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7h8M8 11h8M8 15h5"
                />
              </svg>
            </div>
            {/* Conversation Title */}
            <span className="flex-1 text-sm font-medium text-gray-700">
              {conversationTitles[index] || `Conversation ${conversation.id}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConversationList;