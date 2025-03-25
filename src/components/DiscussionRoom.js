import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const DiscussionRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const socket = useRef(null);
  const peerConnection = useRef(null);

  // Initialize Socket.IO and WebRTC
  useEffect(() => {
    if (!roomId) {
      navigate('/'); // Redirect to home if no roomId is provided
      return;
    }

    // Initialize Socket.IO connection
    socket.current = io('http://localhost:5000');
    socket.current.emit('join-room', roomId);

    // Initialize WebRTC
    const initializeWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
        localVideoRef.current.srcObject = stream;

        peerConnection.current = new RTCPeerConnection();

        // Add local stream tracks to the peer connection
        stream.getTracks().forEach((track) => peerConnection.current.addTrack(track, stream));

        // Handle remote stream
        peerConnection.current.ontrack = (event) => {
          setRemoteStream(event.streams[0]);
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        // Handle ICE candidates
        peerConnection.current.onicecandidate = (event) => {
          if (event.candidate) {
            socket.current.emit('ice-candidate', { roomId, candidate: event.candidate });
          }
        };

        // Handle incoming ICE candidates
        socket.current.on('ice-candidate', (candidate) => {
          peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
        });

        // Handle offer
        socket.current.on('offer', async (offer) => {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(offer));
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.current.emit('answer', { roomId, answer });
        });

        // Handle answer
        socket.current.on('answer', async (answer) => {
          await peerConnection.current.setRemoteDescription(new RTCSessionDescription(answer));
        });

        // Create and send an offer
        const offer = await peerConnection.current.createOffer();
        await peerConnection.current.setLocalDescription(offer);
        socket.current.emit('offer', { roomId, offer });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeWebRTC();

    // Cleanup on unmount
    return () => {
      if (peerConnection.current) {
        peerConnection.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [roomId, navigate]);

  // Handle chat messages
  useEffect(() => {
    if (!socket.current) return;

    socket.current.on('chat-message', (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (socket.current) {
        socket.current.off('chat-message');
      }
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && socket.current) {
      socket.current.emit('chat-message', { roomId, message });
      setMessage('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-800 mb-4">Discussion Room 🌴</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Video Call Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-green-800 mb-2">Video Call</h2>
          <div className="grid grid-cols-1 gap-4">
            <video ref={localVideoRef} autoPlay muted className="w-full rounded-lg"></video>
            <video ref={remoteVideoRef} autoPlay className="w-full rounded-lg"></video>
          </div>
        </div>

        {/* Chat Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-bold text-green-800 mb-2">Chat</h2>
          <div className="h-64 overflow-y-auto mb-4">
            {chatMessages.map((msg, index) => (
              <div key={index} className="mb-2">
                <span className="text-green-800 font-bold">User:</span> {msg}
              </div>
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
            <button
              onClick={sendMessage}
              className="bg-green-800 text-white p-2 rounded-r-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscussionRoom;