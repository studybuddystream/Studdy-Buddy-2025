import React, { useState, useEffect, useRef } from 'react';

const ChatPage = ({ connectedFriends, onClose }) => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [inputMessage, setInputMessage] = useState(''); // Store the current message input
  const [selectedFriend, setSelectedFriend] = useState(null); // Track the selected friend to chat with
  const chatEndRef = useRef(null); // Reference to scroll to the bottom of the chat

  // Function to send a message
  const sendMessage = () => {
    if (inputMessage.trim() && selectedFriend) {
      const newMessage = {
        id: messages.length + 1,
        sender: 'You', // Replace with the logged-in user's name
        receiver: selectedFriend.name, // The selected friend's name
        text: inputMessage,
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages([...messages, newMessage]);
      setInputMessage('');
    }
  };

  // Scroll to the bottom of the chat when a new message is added
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg flex flex-col">
      {/* Chat Header */}
      <div className="p-4 bg-green-800 text-white flex justify-between items-center">
        <h2 className="text-lg font-bold">Chat</h2>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <i className="fas fa-times"></i>
        </button>
      </div>

      {/* Friend List */}
      <div className="p-4 border-b">
        <h3 className="font-bold mb-2">Connected Friends</h3>
        <ul className="space-y-2">
          {connectedFriends.map((friend) => (
            <li
              key={friend.id}
              onClick={() => setSelectedFriend(friend)}
              className={`p-2 cursor-pointer rounded-lg ${
                selectedFriend?.id === friend.id
                  ? 'bg-green-100 text-green-800'
                  : 'hover:bg-gray-100'
              }`}
            >
              {friend.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Body */}
      <div className="flex-1 p-4 overflow-y-auto">
        {selectedFriend ? (
          messages
            .filter(
              (message) =>
                message.receiver === selectedFriend.name || message.sender === selectedFriend.name
            )
            .map((message) => (
              <div key={message.id} className="mb-4">
                <div className="text-sm font-semibold">{message.sender}</div>
                <div className="bg-gray-100 p-2 rounded-lg">{message.text}</div>
                <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
              </div>
            ))
        ) : (
          <div className="text-center text-gray-500">Select a friend to start chatting</div>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Chat Input */}
      {selectedFriend && (
        <div className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 border rounded-lg"
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;