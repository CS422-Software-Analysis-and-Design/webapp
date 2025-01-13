// Mock conversation list
export const mockConversations = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
];

// Mock messages per conversation
export const mockMessages = {
  '1': [
    { sender: 'user', text: 'Hi there!' },
    { sender: 'bot', text: 'Hello! How can I assist you today?' },
  ],
  '2': [
    { sender: 'user', text: 'What time is it?' },
    { sender: 'bot', text: 'It is 2 PM.' },
  ],
  '3': [
    { sender: 'user', text: 'Tell me a joke.' },
    { sender: 'bot', text: 'Why did the scarecrow win an award? Because he was outstanding in his field!' },
  ],
};

// Mock bot response function
export const getBotResponse = (userMessage) => {
  // Simple mock response logic
  return { text: "I'm a bot, and this is my response to: " + userMessage };
};
