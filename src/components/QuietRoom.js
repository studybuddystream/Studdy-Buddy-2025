import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatPage from './ChatPage';

const VideoCard = ({ stream, name, email, status, onStatusChange, isOwner, liveDuration, onReact, reactions, onPin, isPinned, isScreenSharing, streakDays, userId, onSendFriendRequest }) => {
  const videoRef = useRef(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [tempStatus, setTempStatus] = useState(status || 'Set your status...');
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const handlePinToggle = () => onPin();

  const handleStatusClick = () => {
    if (isOwner) {
      setIsEditingStatus(true);
    }
  };

  const handleStatusChange = (e) => {
    setTempStatus(e.target.value);
  };

  const handleStatusSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      onStatusChange(tempStatus);
      setIsEditingStatus(false);
    }
  };

  const handleReaction = (reactionType) => {
    onReact(reactionType);
    setShowReactions(false);
  };

  const handleFriendRequest = () => {
    onSendFriendRequest(userId, name);
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`p-1 rounded-lg bg-gray-800 bg-opacity-75 backdrop-blur-lg border ${isPinned ? 'border-yellow-500' : 'border-gray-700/10'} hover:border-purple-500/30 transition-all duration-300 shadow-lg hover:shadow-2xl flex flex-col`}>
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="w-full h-40 object-cover rounded-lg"
        />
        <div className="absolute top-2 right-2 flex space-x-2">
          <span className="bg-gray-600 text-white text-xs rounded-full px-2 py-1">🔥 {streakDays}</span>
          {!isOwner && (
            <button
              onClick={handleFriendRequest}
              className="bg-gray-600 text-white text-xs rounded-full px-2 py-1 hover:bg-gray-500"
            >
              <i className="fas fa-user-plus"></i>
            </button>
          )}
          <button
            onClick={handlePinToggle}
            className="bg-gray-600 text-white text-xs rounded-full px-2 py-1 hover:bg-gray-500"
          >
            <i className="fas fa-thumbtack"></i> {isPinned ? 'Unpin' : 'Pin'}
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm text-white">
          {name}
        </div>
        <div className="absolute bottom-2 right-2">
          <button
            onClick={() => setShowReactions(!showReactions)}
            className="bg-blue-500 px-2 py-1 rounded text-white text-sm"
          >
            <i className="fas fa-smile"></i>
          </button>
          {showReactions && (
            <div className="absolute right-0 bottom-8 flex space-x-2 bg-gray-700 p-2 rounded">
              <button onClick={() => handleReaction('like')} className="text-2xl">👍</button>
              <button onClick={() => handleReaction('heart')} className="text-2xl">❤️</button>
              <button onClick={() => handleReaction('smile')} className="text-2xl">😊</button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex justify-between items-start px-2">
        <div>
          {isEditingStatus ? (
            <input
              type="text"
              value={tempStatus}
              onChange={handleStatusChange}
              onKeyDown={handleStatusSubmit}
              onBlur={handleStatusSubmit}
              className="text-sm text-gray-400 bg-gray-700 rounded px-2 py-1 focus:outline-none"
              autoFocus
            />
          ) : (
            <div
              className="text-sm text-gray-400 cursor-pointer"
              onClick={handleStatusClick}
            >
              {status || 'Set your status...'}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end">
          <div className="text-sm text-gray-400">Live: {formatDuration(liveDuration)}</div>
        </div>
      </div>

      <div className="flex space-x-2 mt-2 px-2">
        {reactions?.like > 0 && <span className="text-blue-400 text-sm">👍 {reactions.like}</span>}
        {reactions?.heart > 0 && <span className="text-blue-400 text-sm">❤️ {reactions.heart}</span>}
        {reactions?.smile > 0 && <span className="text-blue-400 text-sm">😊 {reactions.smile}</span>}
      </div>

      {isScreenSharing && <div className="mt-2 text-sm text-gray-400 px-2">Screen Sharing Active</div>}
    </div>
  );
};

const QuietRoom = () => {
  const [activeItem, setActiveItem] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [focusTime, setFocusTime] = useState(0);
  const [sessions, setSessions] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [treeGrowth, setTreeGrowth] = useState(0);
  const [customWorkTime, setCustomWorkTime] = useState(25);
  const [customBreakTime, setCustomBreakTime] = useState(5);
  const [longBreakTime, setLongBreakTime] = useState(15);
  const [cycles, setCycles] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(false);
  const [liveDurations, setLiveDurations] = useState({});
  const navigate = useNavigate();
  const hasJoined = useRef(false);
  const streamRef = useRef(null);

  const [streakDays, setStreakDays] = useState(() => {
    const savedStreak = localStorage.getItem('streakDays');
    return savedStreak ? parseInt(savedStreak) : 1;
  });
  const [lastVisit, setLastVisit] = useState(() => {
    const savedLastVisit = localStorage.getItem('lastVisit');
    return savedLastVisit ? new Date(savedLastVisit) : null;
  });

  const registeredUser = {
    id: 'user123',
    name: 'You',
    email: 'john.doe@example.com',
    mobileNumber: '+1234567890',
    address: '123 Main St, City, Country',
    streakDays: streakDays,
  };

  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (!lastVisit) {
      setStreakDays(1);
      localStorage.setItem('streakDays', '1');
      localStorage.setItem('lastVisit', today.toISOString());
    } else {
      const lastVisitDate = new Date(lastVisit);
      lastVisitDate.setHours(0, 0, 0, 0);

      const diffTime = today - lastVisitDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        setStreakDays((prev) => {
          const newStreak = prev + 1;
          localStorage.setItem('streakDays', newStreak.toString());
          return newStreak;
        });
      } else if (diffDays > 1) {
        setStreakDays(1);
        localStorage.setItem('streakDays', '1');
      }
    }

    localStorage.setItem('lastVisit', today.toISOString());
    setLastVisit(today);
  }, []);

  const stopStreamTracks = (stream) => {
    if (stream) {
      stream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch (error) {
          console.error('Error stopping track:', error);
        }
      });
    }
  };

  const handleCameraToggle = async () => {
    if (isCameraOn) {
      stopStreamTracks(streamRef.current);
      streamRef.current = null;

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === registeredUser.id ? { ...u, stream: null } : u
        )
      );
      setIsCameraOn(false);
      setIsMicOn(false);
    } else {
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = newStream;

        const audioTrack = newStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = false;
        }

        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === registeredUser.id
              ? { ...u, stream: newStream, originalStream: newStream }
              : u
          )
        );
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Failed to access the camera. Please check permissions.');
        setIsCameraOn(false);
      }
    }
  };

  const handleMicToggle = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const handleScreenShareToggle = async () => {
    const user = users.find((u) => u.id === registeredUser.id);
    if (!user) return;

    if (!user.isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        stopStreamTracks(user.stream);
        stopStreamTracks(user.originalStream);
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === registeredUser.id ? { ...u, stream: screenStream, isScreenSharing: true } : u
          )
        );
        streamRef.current = screenStream;
        screenStream.getVideoTracks()[0].onended = () => {
          handleScreenShareToggle();
        };
      } catch (error) {
        console.error('Error starting screen share:', error);
        alert('Failed to start screen sharing.');
      }
    } else {
      stopStreamTracks(streamRef.current);
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        const audioTrack = newStream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = isMicOn;
        }
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === registeredUser.id ? { ...u, stream: newStream, originalStream: newStream, isScreenSharing: false } : u
          )
        );
        streamRef.current = newStream;
        setIsCameraOn(true);
      } catch (error) {
        console.error('Error reverting to camera stream:', error);
        alert('Failed to revert to camera stream.');
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u.id === registeredUser.id ? { ...u, stream: null, originalStream: null, isScreenSharing: false } : u
          )
        );
        streamRef.current = null;
        setIsCameraOn(false);
      }
    }
  };

  const handleTimerEnd = () => {
    if (isBreak) {
      setIsBreak(false);
      setCycles((prev) => prev + 1);
      setSessions((prev) => prev + 1);
      setFocusTime((prev) => prev + customWorkTime);
      setTimer(customWorkTime * 60);
      alert('Break ended! Time to focus.');
    } else {
      if (cycles > 0 && cycles % 4 === 0) {
        setTimer(longBreakTime * 60);
        alert('Great work! Take a long break.');
      } else {
        setTimer(customBreakTime * 60);
        alert('Work session completed! Take a short break.');
      }
      setIsBreak(true);
    }
  };

  const handleStartTimer = () => {
    setIsTimerRunning(true);
    setTimer(isBreak ? customBreakTime * 60 : customWorkTime * 60);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
    setTreeGrowth(0);
    alert('Tree has withered! Stay focused to grow it back.');
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimer(0);
    setIsBreak(false);
    setCycles(0);
    setTreeGrowth(0);
    alert('Timer reset. Start a new session to grow a tree!');
  };

  const applyPreset = (work, shortBreak, longBreak) => {
    setCustomWorkTime(work);
    setCustomBreakTime(shortBreak);
    setLongBreakTime(longBreak);
    setIsSettingsOpen(false);
    alert(`Preset applied: ${work}/${shortBreak}/${longBreak} minutes`);
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLeaveRoom = () => {
    stopStreamTracks(streamRef.current);
    streamRef.current = null;
    users.forEach((user) => {
      stopStreamTracks(user.stream);
      stopStreamTracks(user.originalStream);
    });
    setUsers([]);
    setIsCameraOn(false);
    setIsMicOn(false);
    setLiveDurations({});
    hasJoined.current = false;
    navigate('/');
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )
    );
  };

  const handleReact = (userId, reactionType) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === userId) {
          const currentReactions = user.reactions || { like: 0, heart: 0, smile: 0 };
          return {
            ...user,
            reactions: {
              ...currentReactions,
              [reactionType]: (currentReactions[reactionType] || 0) + 1,
            },
          };
        }
        return user;
      })
    );
  };

  const handlePinToggle = (userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isPinned: !user.isPinned } : user
      )
    );
  };

  const handleSendFriendRequest = (userId, userName) => {
    alert(`Friend request sent to ${userName} (ID: ${userId})!`);
  };

  const handleStudyCircleClick = () => {
    stopStreamTracks(streamRef.current);
    streamRef.current = null;
    users.forEach((user) => {
      stopStreamTracks(user.stream);
      stopStreamTracks(user.originalStream);
    });
    setUsers([]);
    setIsCameraOn(false);
    setIsMicOn(false);
    setLiveDurations({});
    hasJoined.current = false;
    navigate('/study-circle', { state: { connectedFriends: [] } });
  };

  const handleItemClick = (item) => {
    setActiveItem(item === activeItem ? null : item);
    if (item === 'chat') {
      setIsChatOpen(!isChatOpen);
    } else if (item === 'profile') {
      stopStreamTracks(streamRef.current);
      streamRef.current = null;
      users.forEach((user) => {
        stopStreamTracks(user.stream);
        stopStreamTracks(user.originalStream);
      });
      setUsers([]);
      setIsCameraOn(false);
      setIsMicOn(false);
      setLiveDurations({});
      hasJoined.current = false;
      navigate('/profile', { state: { user: registeredUser } });
    }
  };

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, { text: newTodo, completed: false }]);
      setNewTodo('');
    }
  };

  const toggleTodo = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  useEffect(() => {
    const joinVideo = async () => {
      if (hasJoined.current) return;
      hasJoined.current = true;

      try {
        const existingUser = users.find((user) => user.id === registeredUser.id);
        if (existingUser) {
          alert('You have already joined the Quiet Room with a video card.');
          return;
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = stream;

        const audioTrack = stream.getAudioTracks()[0];
        if (audioTrack) {
          audioTrack.enabled = false;
        }

        const user = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: registeredUser.email,
          stream,
          originalStream: stream,
          isScreenSharing: false,
          status: 'Set your status...',
          reactions: { like: 0, heart: 0, smile: 0 },
          isPinned: false,
          streakDays: streakDays,
          joinTime: Date.now(),
        };
        setUsers((prevUsers) => {
          if (prevUsers.some((u) => u.id === user.id)) return prevUsers;
          return [...prevUsers, user];
        });
      } catch (error) {
        hasJoined.current = false;
        if (error.name === 'NotAllowedError') {
          alert('Camera and microphone access denied. Please grant permissions to join.');
        } else if (error.name === 'NotFoundError') {
          alert('No camera or microphone found. Please connect a device to join.');
        } else {
          console.error('Error accessing media devices:', error);
          alert('An error occurred while joining the Quiet Room.');
        }
      }
    };

    joinVideo();

    return () => {
      stopStreamTracks(streamRef.current);
      streamRef.current = null;
      users.forEach((user) => {
        stopStreamTracks(user.stream);
        stopStreamTracks(user.originalStream);
      });
      setUsers([]);
      setIsCameraOn(false);
      setIsMicOn(false);
      setLiveDurations({});
      hasJoined.current = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveDurations((prev) => {
        const newDurations = { ...prev };
        users.forEach((user) => {
          if (user.joinTime) {
            const duration = Math.floor((Date.now() - user.joinTime) / 1000);
            newDurations[user.id] = duration;
          }
        });
        return newDurations;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [users]);

  useEffect(() => {
    let timerInterval;
    if (isTimerRunning) {
      timerInterval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 0) {
            clearInterval(timerInterval);
            handleTimerEnd();
            return 0;
          }
          return prevTimer - 1;
        });
        const totalTime = isBreak ? customBreakTime * 60 : customWorkTime * 60;
        const growth = ((totalTime - timer) / totalTime) * 100;
        setTreeGrowth(Math.min(Math.max(growth, 0), 100));
      }, 1000);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isTimerRunning, isBreak, customWorkTime, customBreakTime, timer]);

  // Sort users: pinned first, then by live duration descending
  const sortedUsers = [...users].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (liveDurations[b.id] || 0) - (liveDurations[a.id] || 0);
  });

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="flex-1 p-6">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-green-900 p-6 rounded-lg text-center">
            <h2 className="text-lg font-semibold">Todo List</h2>
            <div className="mt-4">
              <div className="bg-gray-800 p-2 rounded mb-2 text-left">
                <form onSubmit={handleAddTodo} className="flex mb-2">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a task..."
                    className="w-full p-2 bg-gray-700 text-white rounded-l focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 px-4 py-2 rounded-r hover:bg-blue-600"
                  >
                    Add
                  </button>
                </form>
                <ul className="space-y-1">
                  {todos.map((todo, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={todo.completed}
                          onChange={() => toggleTodo(index)}
                          className="mr-2 h-5 w-5 text-blue-600 focus:ring-blue-500"
                        />
                        <span className={todo.completed ? 'line-through text-gray-400' : 'text-white'}>
                          {todo.text}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteTodo(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="bg-green-900 p-6 rounded-lg text-center">
            <h2 className="text-lg font-semibold">Focus Timer</h2>
            <div className="text-4xl font-bold mt-2">{formatTime(timer)}</div>
            <div className="mt-2 text-sm">
              <p>Total Focus Time: {Math.floor(focusTime / 60)}h {focusTime % 60}m</p>
              <p>Completed Sessions: {sessions}</p>
            </div>
            <div className="mt-4">
              <p>Tree Growth: {treeGrowth.toFixed(2)}% - {treeGrowth < 30 ? '🌱' : treeGrowth < 70 ? '🌲' : '🌳'}</p>
              <div className="flex justify-center space-x-2 mt-2">
                <button
                  onClick={handleStartTimer}
                  className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
                  disabled={isTimerRunning}
                >
                  Start
                </button>
                <button
                  onClick={handlePauseTimer}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
                  disabled={!isTimerRunning}
                >
                  Pause
                </button>
                <button
                  onClick={handleResetTimer}
                  className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  className="bg-gray-500 px-2 py-2 rounded hover:bg-gray-600"
                >
                  <i className="fas fa-cog"></i>
                </button>
              </div>
              {isSettingsOpen && (
                <div className="mt-4 bg-gray-800 p-4 rounded-lg text-left">
                  <h3 className="text-md font-semibold mb-2">Presets</h3>
                  <button
                    onClick={() => applyPreset(25, 5, 15)}
                    className="bg-blue-500 px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    25/5/15
                  </button>
                  <button
                    onClick={() => applyPreset(50, 10, 15)}
                    className="bg-blue-500 px-3 py-1 rounded mr-2 hover:bg-blue-600"
                  >
                    50/10/15
                  </button>
                  <button
                    onClick={() => applyPreset(60, 10, 15)}
                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                  >
                    60/10/15
                  </button>
                  <div className="mt-2">
                    <label>Work Time (min): 
                      <input
                        type="number"
                        value={customWorkTime}
                        onChange={(e) => setCustomWorkTime(parseInt(e.target.value) || 25)}
                        className="ml-2 p-1 bg-gray-700 text-white rounded"
                        min="1"
                      />
                    </label>
                    <br />
                    <label>Short Break (min): 
                      <input
                        type="number"
                        value={customBreakTime}
                        onChange={(e) => setCustomBreakTime(parseInt(e.target.value) || 5)}
                        className="ml-2 p-1 bg-gray-700 text-white rounded"
                        min="1"
                      />
                    </label>
                    <br />
                    <label>Long Break (min): 
                      <input
                        type="number"
                        value={longBreakTime}
                        onChange={(e) => setLongBreakTime(parseInt(e.target.value) || 15)}
                        className="ml-2 p-1 bg-gray-700 text-white rounded"
                        min="1"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-green-900 p-6 rounded-lg overflow-x-auto whitespace-nowrap">
          <h2 className="text-lg font-semibold">Quiet Room</h2>
          <div className="mt-4 flex items-center space-x-4">
            <div className="text-sm text-gray-400">Active Users: {users.length}</div>
            <div className="flex space-x-2">
              <button
                onClick={handleCameraToggle}
                className={`px-2 py-1 rounded text-white text-sm ${isCameraOn ? 'bg-green-600' : 'bg-red-600'}`}
              >
                <i className={`fas ${isCameraOn ? 'fa-video' : 'fa-video-slash'}`}></i>
              </button>
              <button
                onClick={handleMicToggle}
                className={`px-2 py-1 rounded text-white text-sm ${isMicOn ? 'bg-green-600' : 'bg-red-600'}`}
              >
                <i className={`fas ${isMicOn ? 'fa-microphone' : 'fa-microphone-slash'}`}></i>
              </button>
              <button
                onClick={handleScreenShareToggle}
                className="bg-blue-600 px-2 py-1 rounded text-white text-sm"
              >
                <i className="fas fa-desktop"></i> {users.find((u) => u.id === registeredUser.id)?.isScreenSharing ? 'Stop Share' : 'Share Screen'}
              </button>
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            {sortedUsers.map((user) => (
              <VideoCard
                key={user.id}
                stream={user.stream}
                name={user.name}
                email={user.email}
                status={user.status}
                onStatusChange={(newStatus) => handleStatusChange(user.id, newStatus)}
                isOwner={user.id === registeredUser.id}
                liveDuration={liveDurations[user.id] || 0}
                onReact={(reactionType) => handleReact(user.id, reactionType)}
                reactions={user.reactions}
                onPin={() => handlePinToggle(user.id)}
                isPinned={user.isPinned}
                isScreenSharing={user.isScreenSharing}
                streakDays={user.streakDays}
                userId={user.id}
                onSendFriendRequest={handleSendFriendRequest}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-20 bg-green-800 text-white p-6 flex flex-col min-h-screen">
        <ul className="space-y-4 flex-1">
          <li>
            <div
              className={`flex flex-col items-center space-y-2 cursor-pointer group ${activeItem === 'circle' ? 'text-yellow-300' : ''}`}
              onClick={() => {
                stopStreamTracks(streamRef.current);
                streamRef.current = null;
                users.forEach((user) => {
                  stopStreamTracks(user.stream);
                  stopStreamTracks(user.originalStream);
                });
                setUsers([]);
                setIsCameraOn(false);
                setIsMicOn(false);
                setLiveDurations({});
                hasJoined.current = false;
                navigate('/circle');
              }}
            >
              <i className="fas fa-users text-2xl"></i>
              <span
                className={`${activeItem === 'circle' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200 text-sm`}
              >
                Circle
              </span>
            </div>
          </li>
          <li>
            <div
              className={`flex flex-col items-center space-y-2 cursor-pointer group ${activeItem === 'profile' ? 'text-yellow-300' : ''}`}
              onClick={() => handleItemClick('profile')}
            >
              <i className="fas fa-user text-2xl"></i>
              <span
                className={`${activeItem === 'profile' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200 text-sm`}
              >
                Profile
              </span>
            </div>
          </li>
          <li>
            <div
              className={`flex flex-col items-center space-y-2 cursor-pointer group ${activeItem === 'chat' ? 'text-yellow-300' : ''}`}
              onClick={() => handleItemClick('chat')}
            >
              <i className="fas fa-comment text-2xl"></i>
              <span
                className={`${activeItem === 'chat' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200 text-sm`}
              >
                Chat
              </span>
            </div>
          </li>
          <li>
            <div
              className={`flex flex-col items-center space-y-2 cursor-pointer group ${activeItem === 'study-circle' ? 'text-yellow-300' : ''}`}
              onClick={handleStudyCircleClick}
            >
              <i className="fas fa-book text-2xl"></i>
              <span
                className={`${activeItem === 'study-circle' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200 text-sm`}
              >
                Study Circle
              </span>
            </div>
          </li>
          <li>
            <div
              className={`flex flex-col items-center space-y-2 cursor-pointer group ${activeItem === 'streak' ? 'text-yellow-300' : ''}`}
              onClick={() => {
                stopStreamTracks(streamRef.current);
                streamRef.current = null;
                users.forEach((user) => {
                  stopStreamTracks(user.stream);
                  stopStreamTracks(user.originalStream);
                });
                setUsers([]);
                setIsCameraOn(false);
                setIsMicOn(false);
                setLiveDurations({});
                hasJoined.current = false;
                navigate('/streak');
              }}
            >
              <i className="fas fa-fire text-2xl"></i>
              <span
                className={`${activeItem === 'streak' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-200 text-sm`}
              >
                Streak & Hours
              </span>
            </div>
          </li>
        </ul>
        <div className="mt-auto text-center">
          <button
            onClick={handleLeaveRoom}
            className="bg-red-500 px-0.5 text-white py-1 rounded-lg hover:bg-red-600 justify-center"
          >
            Leave Room
          </button>
        </div>
      </div>

      {isChatOpen && (
        <ChatPage
          connectedFriends={users.map((u) => ({ id: u.id, name: u.name }))}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
};

export default QuietRoom;