import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="w-64 bg-green-800 text-white p-6">
  <h2 className="text-2xl font-bold mb-8">Study Buddy</h2>
  <ul className="space-y-4">
    <li>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => handleItemClick('home')}
      >
        <i className="fas fa-home"></i>
        <span
          className={`${activeItem === 'home' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
        >
          Home
        </span>
      </div>
    </li>
    <li>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => handleItemClick('community')}
      >
        <i className="fas fa-users"></i>
        <span
          className={`${activeItem === 'community' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
        >
          Community
        </span>
      </div>
    </li>
    <li>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => handleItemClick('profile')}
      >
        <i className="fas fa-user"></i>
        <span
          className={`${activeItem === 'profile' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
        >
          Profile
        </span>
      </div>
    </li>
    <li>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => handleItemClick('chat')}
      >
        <i className="fas fa-comment"></i>
        <span
          className={`${activeItem === 'chat' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
        >
          Chat
        </span>
      </div>
    </li>
    <li>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => handleItemClick('study-circle')}
      >
        <i className="fas fa-book"></i>
        <span
          className={`${activeItem === 'study-circle' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
        >
          Study Circle
        </span>
      </div>
    </li>
    <li>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => handleItemClick('streak')}
      >
        <i className="fas fa-fire"></i>
        <span
          className={`${activeItem === 'streak' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
        >
          Streak
        </span>
      </div>
    </li>
    <li>
      <div
        className="flex items-center space-x-2 cursor-pointer group"
        onClick={() => handleItemClick('study-hour')}
      >
        <i className="fas fa-clock"></i>
        <span
          className={`${activeItem === 'study-hour' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200`}
        >
          Study Hour
        </span>
      </div>
    </li>
  </ul>
</div>
  );
};

export default Sidebar;