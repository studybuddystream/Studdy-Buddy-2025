import React from 'react';
import { useLocation } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const StreakPage = () => {
  const location = useLocation();
  const { streak, studyHours } = location.state || { streak: 0, studyHours: 0 };

  // Mock data for monthly streak and study hours (replace with actual data)
  const monthlyData = [
    { day: 'Week 1', streak: 5, studyHours: 10 },
    { day: 'Week 2', streak: 7, studyHours: 15 },
    { day: 'Week 3', streak: 3, studyHours: 8 },
    { day: 'Week 4', streak: 6, studyHours: 12 },
  ];

  // Mock data for yearly streak and study hours (replace with actual data)
  const yearlyData = [
    { month: 'Jan', streak: 20, studyHours: 50 },
    { month: 'Feb', streak: 25, studyHours: 60 },
    { month: 'Mar', streak: 18, studyHours: 45 },
    { month: 'Apr', streak: 22, studyHours: 55 },
    { month: 'May', streak: 30, studyHours: 70 },
    { month: 'Jun', streak: 28, studyHours: 65 },
    { month: 'Jul', streak: 15, studyHours: 40 },
    { month: 'Aug', streak: 10, studyHours: 30 },
    { month: 'Sep', streak: 12, studyHours: 35 },
    { month: 'Oct', streak: 20, studyHours: 50 },
    { month: 'Nov', streak: 25, studyHours: 60 },
    { month: 'Dec', streak: 30, studyHours: 70 },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-green-800 mb-6">Your Progress</h1>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Current Streak and Study Hours */}
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Current Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800">Current Streak</h3>
            <p className="text-lg">
              Your current streak is <span className="font-bold">{streak}</span> days!
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold text-green-800">Total Study Hours</h3>
            <p className="text-lg">
              You've studied for <span className="font-bold">{studyHours}</span> hours!
            </p>
          </div>
        </div>

        {/* Monthly Progress Graph */}
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Monthly Progress</h2>
        <div className="h-64 mb-8">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="streak" fill="#10B981" name="Streak (days)" />
              <Bar dataKey="studyHours" fill="#3B82F6" name="Study Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Progress Graph */}
        <h2 className="text-2xl font-semibold text-green-800 mb-4">Yearly Progress</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={yearlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="streak" fill="#10B981" name="Streak (days)" />
              <Bar dataKey="studyHours" fill="#3B82F6" name="Study Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StreakPage;