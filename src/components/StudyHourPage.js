import React from 'react';
import { useLocation } from 'react-router-dom';

const StudyHourPage = () => {
  const location = useLocation();
  const { studyHours } = location.state || { studyHours: 0 };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Study Hour Data</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-green-800">Total Study Hours</h2>
        <p className="text-lg mt-2">
          You have spent a total of <span className="font-bold">{studyHours}</span> hours studying on Study Buddy.
        </p>
      </div>
    </div>
  );
};

export default StudyHourPage;