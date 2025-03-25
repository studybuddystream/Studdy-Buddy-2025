import React from 'react';

const Achievements = ({ achievements = {} }) => {
  const getIcon = (key) => {
    switch (key) {
      case 'firstStudySession':
        return 'graduation-cap';
      case 'studyStreak':
        return 'fire';
      case 'pomodoroMaster':
        return 'clock';
      case 'studyChampion':
        return 'trophy';
      case 'teamPlayer':
        return 'users';
      case 'bestBuddy':
        return 'heart';
      default:
        return '';
    }
  };

  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-green-800 flex items-center">
        <i className="fas fa-trophy mr-2"></i>Achievements
      </h2>
      <div className="grid grid-cols-2 gap-4 mt-4 sm:grid-cols-3 lg:grid-cols-6">
        {Object.entries(achievements).map(([key, value]) => (
          <div
            key={key}
            className={`bg-green-200 p-6 rounded-lg shadow text-center ${
              value ? 'bg-green-300' : ''
            }`}
          >
            <i className={`fas fa-${getIcon(key)} text-4xl text-gray-600`}></i>
            <p className="text-lg text-gray-600 mt-2">{formatKey(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;