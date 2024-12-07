import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import MessageThread from '../../components/common/MessageThread';

const MessagesPage = () => {
  const { darkMode } = useTheme();
  const [selectedChat, setSelectedChat] = useState(null);
  
  // Mock data for demonstration
  const mockChats = [
    {
      id: 1,
      childminderName: 'Emma Williams',
      lastMessage: 'See you tomorrow at 9!',
      timestamp: new Date('2024-12-06T10:30:00'),
      unread: true,
      status: 'active'
    },
    {
      id: 2,
      childminderName: 'Sarah Smith',
      lastMessage: 'Are you available next week?',
      timestamp: new Date('2024-12-05T15:45:00'),
      unread: false,
      status: 'pending'
    },
    {
      id: 3,
      childminderName: 'Lisa Brown',
      lastMessage: 'Perfect, thank you!',
      timestamp: new Date('2024-12-05T09:15:00'),
      unread: false,
      status: 'completed'
    }
  ];

  const mockMessages = [
    {
      id: 1,
      content: 'Hi Emma, are you available next Monday?',
      senderId: 'currentUser',
      timestamp: new Date('2024-12-06T10:00:00')
    },
    {
      id: 2,
      content: 'Hi Sarah! Yes, I am available from 9 AM to 5 PM on Monday.',
      senderId: 'childminder1',
      timestamp: new Date('2024-12-06T10:05:00')
    },
    {
      id: 3,
      content: 'Perfect! I would like to book for the whole day.',
      senderId: 'currentUser',
      timestamp: new Date('2024-12-06T10:07:00')
    }
  ];

  const handleSendMessage = (message) => {
    console.log('Sending message:', message);
    // Here you would typically make an API call to send the message
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100'
    };
    return colors[status];
  };

  return (
    <div className={`grid grid-cols-12 gap-6 h-[calc(100vh-200px)]`}>
      {/* Chat List */}
      <div className="col-span-12 md:col-span-4">
        <div className={`rounded-lg shadow-md h-full ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-60px)]">
            {mockChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 cursor-pointer border-b ${
                  darkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-50'
                } ${selectedChat?.id === chat.id ? darkMode ? 'bg-gray-700' : 'bg-gray-100' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{chat.childminderName}</h3>
                    <p className="text-sm opacity-75 truncate">{chat.lastMessage}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs opacity-75">{formatTime(chat.timestamp)}</span>
                    {chat.unread && (
                      <span className="block mt-1 w-2 h-2 rounded-full bg-blue-600 ml-auto"></span>
                    )}
                  </div>
                </div>
                <div className="mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(chat.status)}`}>
                    {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Thread */}
      <div className="col-span-12 md:col-span-8">
        <div className={`rounded-lg shadow-md h-full ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {selectedChat ? (
            <>
              <div className="p-4 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">{selectedChat.childminderName}</h2>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(selectedChat.status)}`}>
                      {selectedChat.status.charAt(0).toUpperCase() + selectedChat.status.slice(1)}
                    </span>
                  </div>
                  {selectedChat.status === 'active' && (
                    <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      View Booking
                    </button>
                  )}
                </div>
              </div>
              <div className="h-[calc(100%-60px)]">
                <MessageThread
                  messages={mockMessages}
                  currentUser={{ id: 'currentUser' }}
                  onSendMessage={handleSendMessage}
                />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center opacity-50">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;