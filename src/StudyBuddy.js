import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Achievements from './components/Achievements';
import StudyRooms from './components/StudyRooms';
import QuietRoom from './components/QuietRoom';
import Circle from './components/Circle';
import ProfilePage from './components/ProfilePage';
import ChatPage from './components/ChatPage';
import StudyCirclePage from './components/StudyCirclePage';
import StreakPage from './components/StreakPage';
import StudyHourPage from './components/StudyHourPage';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { AuthContext, AuthProvider } from './AuthContext';
import './App.css';
import DiscussionRoom from './components/DiscussionRoom';

const StudyBuddy = () => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('Location: India');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [achievements, setAchievements] = useState({
    firstStudySession: false,
    studyStreak: 0,
    pomodoroMaster: 0,
    studyChampion: false,
    teamPlayer: false,
    bestBuddy: false,
  });
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const { user, isAuthenticated, logout } = useContext(AuthContext); // Removed 'login'

  const locationSuggestions = [
    { name: 'India', timezone: 'Asia/Kolkata' },
    { name: 'New York, USA', timezone: 'America/New_York' },
    { name: 'London, UK', timezone: 'Europe/London' },
    { name: 'Tokyo, Japan', timezone: 'Asia/Tokyo' },
    { name: 'Sydney, Australia', timezone: 'Australia/Sydney' },
    { name: 'Berlin, Germany', timezone: 'Europe/Berlin' },
  ];

  // Handle login/signup to update authenticatedUser
  const handleLogin = (userData) => {
    setAuthenticatedUser({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      bio: userData.bio || 'New to StudyBuddy',
      following: userData.following || [],
      bookmarks: userData.bookmarks || [],
    });
  };

  // Sync authenticatedUser with AuthContext user
  useEffect(() => {
    const syncUser = () => {
      if (isAuthenticated && user) {
        setAuthenticatedUser({
          id: user.id,
          username: user.username,
          email: user.email,
          bio: user.bio || 'New to StudyBuddy',
          following: user.following || [],
          bookmarks: user.bookmarks || [],
        });
      } else {
        setAuthenticatedUser(null);
      }
    };
    syncUser();
  }, [isAuthenticated, user]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = { timeZone: timezone, hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
      const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getFullYear()).slice(-2)}`;
      setDate(formattedDate);
      setTime(now.toLocaleTimeString('en-US', options));
    };
    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);
    return () => clearInterval(intervalId);
  }, [timezone]);

  useEffect(() => {
    const simulateStudySession = () => {
      setAchievements((prev) => ({
        ...prev,
        firstStudySession: true,
        studyStreak: prev.studyStreak + 1,
        pomodoroMaster: prev.pomodoroMaster + 1,
        studyChampion: prev.studyStreak >= 7,
        teamPlayer: true,
        bestBuddy: true,
      }));
    };
    const timeoutId = setTimeout(simulateStudySession, 5000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setTempLocation(value);
    const filteredSuggestions = locationSuggestions.filter((loc) =>
      loc.name.toLowerCase().includes(value.toLowerCase())
    );
    setSuggestions(filteredSuggestions);
  };

  const handleLocationSelect = (selectedLocation) => {
    setTempLocation(selectedLocation.name);
    setTimezone(selectedLocation.timezone);
    setSuggestions([]);
  };

  const handleLocationUpdate = () => {
    if (tempLocation.trim()) {
      setLocation(`Location: ${tempLocation}`);
      setIsEditingLocation(false);
    }
  };

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar isLoggedIn={isAuthenticated} onLogout={logout} />
        <div className="bg-green-100 p-6 rounded-lg shadow-lg w-full max-w-full mx-auto flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold text-green-800">Study Buddy</h1>
                    <p className="text-lg text-gray-600">{date}</p>
                    <p className="text-lg text-gray-600">{time}</p>
                    <div className="flex items-center justify-center space-x-2">
                      <p className="text-lg text-gray-600">{location}</p>
                      <button
                        onClick={() => setIsEditingLocation(!isEditingLocation)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </div>
                    {isEditingLocation && (
                      <div className="mt-2">
                        <input
                          type="text"
                          placeholder="Enter your location"
                          value={tempLocation}
                          onChange={handleLocationInputChange}
                          className="px-2 py-1 border rounded-lg"
                        />
                        <button
                          onClick={handleLocationUpdate}
                          className="ml-2 bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                        >
                          Save
                        </button>
                        {suggestions.length > 0 && (
                          <ul className="mt-2 bg-white border rounded-lg shadow-lg">
                            {suggestions.map((loc, index) => (
                              <li
                                key={index}
                                onClick={() => handleLocationSelect(loc)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                              >
                                {loc.name}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                  <StudyRooms achievements={achievements} />
                  <Achievements achievements={achievements} />
                </>
              }
            />
            <Route path="/signin" element={<SignIn onLogin={handleLogin} />} />
            <Route path="/signup" element={<SignUp onLogin={handleLogin} />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/quiet-room" element={<QuietRoom />} />
              <Route
                path="/profile"
                element={
                  <ProfilePage 
                    studyHours={10} 
                    streak={5} 
                    connectedFriends={[]} 
                    authenticatedUser={authenticatedUser}
                  />
                }
              />
              <Route 
                path="/circle" 
                element={<Circle authenticatedUser={authenticatedUser} />} 
              />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/study-circle" element={<StudyCirclePage />} />
              <Route path="/streak" element={<StreakPage />} />
              <Route path="/study-hour" element={<StudyHourPage />} />
              <Route path="/discussion-room" element={<DiscussionRoom />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/signin" />;
};

// Wrap StudyBuddy with AuthProvider
const App = () => (
  <AuthProvider>
    <StudyBuddy />
  </AuthProvider>
);

export default App;