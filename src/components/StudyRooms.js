import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const StudyRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate fetching room data from an API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // Simulate an API call with a delay
        const mockRooms = [
          {
            icon: 'leaf',
            name: 'Quiet Room 🌳',
            description: 'Perfect for silent study sessions.',
            link: '/quiet-room',
          },
          {
            icon: 'users',
            name: 'Circle 🌲',
            description: 'Ideal for collaborative learning.',
            link: '/circle',
          },
          {
            icon: 'comments',
            name: 'Discussion Room 🌴',
            description: 'Great for group discussions.',
            link: '/discussion-room/1', // Added Room ID to match dynamic routing in DiscussionRoom.js
          },
          {
            icon: 'music',
            name: 'Lofi Room 🌵',
            description: 'Relax and study with lofi music.',
            link: '/lofi-room',
          },
        ];

        // Simulate a 1-second delay for the API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setRooms(mockRooms);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch room data. Please try again later.');
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-green-800 text-lg">Loading rooms...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="mb-6 p-6">
      <h2 className="text-2xl font-bold text-green-800 flex items-center">
        <i className="fas fa-door-open mr-2"></i>Study Rooms
      </h2>
      <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 lg:grid-cols-4">
        {rooms.map((room, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition-shadow duration-300"
          >
            <i className={`fas fa-${room.icon} text-4xl text-green-800 mb-4`}></i>
            <p className="text-lg font-bold text-green-800">{room.name}</p>

            {/* Show 'Upcoming' tag for Lofi Room */}
            {room.name === 'Lofi Room 🌵' && (
    <span className="bg-yellow-400 text-black text-xs font-bold py-1 px-2 rounded-full inline-block mb-2">
      Upcoming
    </span>
  )}
            <p className="text-md text-gray-600">{room.description}</p>
            <Link
              to={room.link}
              className="mt-4 inline-block bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-900 transition-colors duration-300"
            >
              {room.name.includes('Circle') ? 'Post' : `Join ${room.name.split(' ')[0]} Room`}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyRooms;
