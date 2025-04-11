import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import { AuthContext } from '../AuthContext';

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { token } = useContext(AuthContext); // Get JWT token
  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]); // Support multiple peers
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const localVideoRef = useRef(null);
  const socket = useRef(null);
  const peerConnections = useRef({}); // Store multiple peer connections

  useEffect(() => {
    console.log('DiscussionRoom mounted. Room ID:', roomId, 'Token:', token ? 'Present' : 'Missing');
    if (!roomId || !token) {
      console.log('Redirecting to /signin due to missing roomId or token');
      navigate('/signin');
      return;
    }

    // Initialize Socket.IO with JWT token
    socket.current = io('http://localhost:5000', {
      query: { token },
      transports: ['websocket', 'polling'], // Ensure connection fallback
    });

    socket.current.on('connect', () => console.log('Socket.IO connected:', socket.current.id));
    socket.current.on('connect_error', (err) => {
      console.error('Socket.IO connection error:', err.message);
      setError('Failed to connect to server');
    });

    socket.current.emit('join-room', roomId);

    const initializeWebRTC = async () => {
      try {
        setIsLoading(true);
        console.log('Requesting media devices...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        console.log('Local stream initialized');

        // Listen for user joins to create peer connections
        socket.current.on('user-joined', (username) => {
          console.log(`${username} joined the room`);
          const pc = createPeerConnection(username);
          peerConnections.current[username] = pc;
          addLocalTracks(pc, stream);
          createAndSendOffer(pc, username);
        });

        socket.current.on('user-left', (username) => {
          console.log(`${username} left the room`);
          if (peerConnections.current[username]) {
            peerConnections.current[username].close();
            delete peerConnections.current[username];
            setRemoteStreams((prev) => prev.filter((s) => s.username !== username));
          }
        });

        socket.current.on('offer', async (offer) => {
          console.log('Received offer');
          const username = offer.username || 'unknown'; // Assume server sends username with offer
          let pc = peerConnections.current[username];
          if (!pc) {
            pc = createPeerConnection(username);
            peerConnections.current[username] = pc;
            addLocalTracks(pc, stream);
          }
          await pc.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.current.emit('answer', { roomId, answer });
        });

        socket.current.on('answer', async (answer) => {
          console.log('Received answer');
          const username = answer.username || 'unknown';
          const pc = peerConnections.current[username];
          if (pc) await pc.setRemoteDescription(new RTCSessionDescription(answer));
        });

        socket.current.on('ice-candidate', (data) => {
          console.log('Received ICE candidate');
          const username = data.username || 'unknown';
          const pc = peerConnections.current[username];
          if (pc) pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        });
      } catch (err) {
        console.error('WebRTC initialization error:', err.message);
        setError(`Failed to initialize WebRTC: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWebRTC();

    return () => {
      console.log('Cleaning up DiscussionRoom');
      if (socket.current) {
        socket.current.disconnect();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      peerConnections.current = {};
    };
  }, [roomId, navigate, token]);

  useEffect(() => {
    if (!socket.current) return;

    socket.current.on('chat-message', (data) => {
      console.log('Chat message received:', data);
      setChatMessages((prev) => [...prev, `${data.username}: ${data.message}`]);
    });

    return () => {
      if (socket.current) socket.current.off('chat-message');
    };
  }, []);

  const createPeerConnection = (username) => {
    const pc = new RTCPeerConnection();
    pc.ontrack = (event) => {
      console.log(`Received remote stream from ${username}`);
      setRemoteStreams((prev) => {
        const exists = prev.find((s) => s.username === username);
        if (!exists) return [...prev, { username, stream: event.streams[0] }];
        return prev;
      });
    };
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', { roomId, candidate: event.candidate, username });
      }
    };
    return pc;
  };

  const addLocalTracks = (pc, stream) => {
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));
  };

  const createAndSendOffer = async (pc, username) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.current.emit('offer', { roomId, offer, username });
  };

  const sendMessage = () => {
    if (message.trim() && socket.current) {
      socket.current.emit('chat-message', { roomId, message });
      setMessage('');
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading Room...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-red-600">Error: {error}</h1>
        <button onClick={() => navigate('/')} className="mt-4 bg-green-800 text-white p-2 rounded">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Discussion Room 🌴 (Room: {roomId})</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-green-800 mb-2">Video Call</h2>
          <div className="grid grid-cols-1 gap-4">
            <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg" />
            {remoteStreams.map((remote, index) => (
              <video
                key={index}
                ref={(ref) => ref && (ref.srcObject = remote.stream)}
                autoPlay
                className="w-full rounded-lg"
              />
            ))}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-green-800 mb-2">Chat</h2>
          <div className="h-64 overflow-y-auto mb-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className="mb-2">{msg}</div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg"
              placeholder="Type a message..."
            />
            <button onClick={sendMessage} className="bg-green-800 text-white p-2 rounded-r-lg">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;