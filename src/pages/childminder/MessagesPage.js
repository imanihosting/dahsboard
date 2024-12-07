import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MessageThread from '../../components/common/MessageThread';

const MessagesPage = () => {
  const { darkMode } = useTheme();
  const [messages] = useState([
    {
      id: 1,
      content: "Hi, I'm interested in your childminding services",
      senderId: 'user1',
      timestamp: new Date('2024-12-06T10:00:00')
    },
    {
      id: 2,
      content: "Hello! Thank you for your interest. I'd be happy to discuss my services.",
      senderId: 'childminder1',
      timestamp: new Date('2024-12-06T10:05:00')
    }
  ]);

  return (
    <div className={`p-6 rounded-lg shadow-md ${
      darkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      <MessageThread messages={messages} currentUserId="childminder1" />
    </div>
  );
};

export default MessagesPage;