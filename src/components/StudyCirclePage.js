import React from 'react';
import { useLocation } from 'react-router-dom';

const StudyCirclePage = () => {
  const location = useLocation();
  const { connectedFriends } = location.state || { connectedFriends: [] };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Study Circle</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-4">Connected Friends</h2>
        {connectedFriends.length > 0 ? (
          <ul className="space-y-2">
            {connectedFriends.map((friend) => (
              <li key={friend.id} className="text-lg text-gray-700">
                {friend.name}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No friends connected yet.</p>
        )}
      </div>
    </div>
  );
};

export default StudyCirclePage;