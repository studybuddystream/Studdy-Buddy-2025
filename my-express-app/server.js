// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const http = require('http');
// const { Server } = require('socket.io');

// // Load environment variables
// dotenv.config();

// // Create the Express app and HTTP server
// const app = express();
// const server = http.createServer(app);

// // Middleware
// app.use(cors());
// app.use(express.json()); // Parse JSON request bodies (replaces bodyParser)

// // MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log('✅ Connected to MongoDB'))
//   .catch(err => console.error('❌ Failed to connect to MongoDB:', err));

// // Define the Post schema
// const postSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   content: { type: String, required: true },
//   category: { type: String, required: true },
//   hashtags: { type: [String], default: [] },
//   upvotes: { type: Number, default: 0 },
//   downvotes: { type: Number, default: 0 },
//   reposts: { type: Number, default: 0 },
//   comments: { type: Array, default: [] },
//   user: { type: Object, required: true }, // Store user info (e.g., username)
//   createdAt: { type: Date, default: Date.now },
// });

// // Create the Post model
// const Post = mongoose.model('Post', postSchema);

// // Routes (assuming userRoutes is meant to be auth routes; adjust as needed)
// app.use('/api/auth', require('./routes/auth')); // From previous setup
// app.use('/api/posts', require('./routes/posts')); // From previous setup

// // Optional: If you have a separate userRoutes.js, uncomment and adjust the path
// // app.use('/api/users', require('./routes/userRoutes'));

// // GET /api/posts - Fetch all posts (moved to routes/posts.js, kept here as fallback)
// app.get('/api/posts', async (req, res) => {
//   try {
//     const posts = await Post.find().sort({ createdAt: -1 }); // Sort by newest first
//     res.json(posts);
//   } catch (err) {
//     console.error('Error fetching posts:', err);
//     res.status(500).json({ message: 'Failed to fetch posts' });
//   }
// });

// // GET /api/posts/trending - Fetch trending posts (moved to routes/posts.js, kept here as fallback)
// app.get('/api/posts/trending', async (req, res) => {
//   try {
//     const trendingPosts = await Post.find()
//       .sort({ upvotes: -1 }) // Sort by upvotes (descending)
//       .limit(5); // Get top 5 trending posts
//     res.json(trendingPosts);
//   } catch (err) {
//     console.error('Error fetching trending posts:', err);
//     res.status(500).json({ message: 'Failed to fetch trending posts' });
//   }
// });

// // POST /api/posts - Create a new post (moved to routes/posts.js, kept here as fallback)
// app.post('/api/posts', async (req, res) => {
//   try {
//     const { title, content, category, hashtags, user } = req.body;

//     // Validate required fields
//     if (!title || !content || !category || !user) {
//       return res.status(400).json({ message: 'Title, content, category, and user are required' });
//     }

//     // Create a new post
//     const newPost = new Post({
//       title,
//       content,
//       category,
//       hashtags: hashtags || [],
//       user,
//     });

//     // Save the post to the database
//     await newPost.save();
//     res.status(201).json(newPost);
//   } catch (err) {
//     console.error('Error creating post:', err);
//     res.status(500).json({ message: 'Failed to create post' });
//   }
// });

// // Socket.IO setup
// const io = new Server(server, {
//   cors: {
//     origin: '*', // Allow all origins (update for production)
//     methods: ['GET', 'POST'],
//   },
// });

// // Store connected users and their rooms
// const users = {};

// // Socket.IO connection handler
// io.on('connection', (socket) => {
//   console.log(`✅ User connected: ${socket.id}`);

//   // Join a room
//   socket.on('join-room', (roomId) => {
//     socket.join(roomId);
//     users[socket.id] = roomId;
//     console.log(`✅ User ${socket.id} joined room ${roomId}`);
//   });

//   // Handle WebRTC signaling: Offer
//   socket.on('offer', ({ roomId, offer }) => {
//     socket.to(roomId).emit('offer', offer);
//     console.log(`📤 Offer sent to room ${roomId}`);
//   });

//   // Handle WebRTC signaling: Answer
//   socket.on('answer', ({ roomId, answer }) => {
//     socket.to(roomId).emit('answer', answer);
//     console.log(`📥 Answer sent to room ${roomId}`);
//   });

//   // Handle WebRTC signaling: ICE Candidate
//   socket.on('ice-candidate', ({ roomId, candidate }) => {
//     socket.to(roomId).emit('ice-candidate', candidate);
//     console.log(`🧊 ICE Candidate sent to room ${roomId}`);
//   });

//   // Handle chat messages
//   socket.on('chat-message', ({ roomId, message }) => {
//     io.to(roomId).emit('chat-message', message);
//     console.log(`💬 Chat message sent to room ${roomId}: ${message}`);
//   });

//   // Handle user disconnect
//   socket.on('disconnect', () => {
//     const roomId = users[socket.id];
//     if (roomId) {
//       socket.leave(roomId);
//       console.log(`❌ User ${socket.id} disconnected from room ${roomId}`);
//       delete users[socket.id];
//     }
//   });
// });

// // Default route
// app.get('/', (req, res) => {
//   console.log('🔁 GET request to /');
//   res.send('Backend is running!');
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Server running on http://localhost:${PORT}`);
// });

//// const express = require('express');
//// const mongoose = require('mongoose');
//// const cors = require('cors');
//// const dotenv = require('dotenv');
//// const http = require('http');
// const { Server } = require('socket.io');

//// // Load environment variables
// dotenv.config();

//// // Create the Express app and HTTP server
// // const app = express();
// // const server = http.createServer(app);

// // // Middleware
// // app.use(cors());
// // app.use(express.json()); // Parse JSON request bodies

// // // MongoDB Connection
// // mongoose.connect(process.env.MONGO_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // })
// //   .then(() => console.log('✅ Connected to MongoDB'))
// //   .catch(err => console.error('❌ Failed to connect to MongoDB:', err));

// // // Routes
// // app.use('/api/auth', require('./routes/auth')); // Authentication routes
// // app.use('/api/posts', require('./routes/posts')); // Post routes

// // // Socket.IO setup
// // const io = new Server(server, {
// //   cors: {
// //     origin: '*', // Allow all origins (update for production)
// //     methods: ['GET', 'POST'],
// //   },
// // });

// // // Store connected users and their rooms
// // const users = {};

// // // Socket.IO connection handler
// // io.on('connection', (socket) => {
// //   console.log(`✅ User connected: ${socket.id}`);

// //   // Join a room
// //   socket.on('join-room', (roomId) => {
// //     socket.join(roomId);
// //     users[socket.id] = roomId;
// //     console.log(`✅ User ${socket.id} joined room ${roomId}`);
// //   });

// //   // Handle WebRTC signaling: Offer
// //   socket.on('offer', ({ roomId, offer }) => {
// //     socket.to(roomId).emit('offer', offer);
// //     console.log(`📤 Offer sent to room ${roomId}`);
// //   });

// //   // Handle WebRTC signaling: Answer
// //   socket.on('answer', ({ roomId, answer }) => {
// //     socket.to(roomId).emit('answer', answer);
// //     console.log(`📥 Answer sent to room ${roomId}`);
// //   });

// //   // Handle WebRTC signaling: ICE Candidate
// //   socket.on('ice-candidate', ({ roomId, candidate }) => {
// //     socket.to(roomId).emit('ice-candidate', candidate);
// //     console.log(`🧊 ICE Candidate sent to room ${roomId}`);
// //   });

// //   // Handle chat messages
// //   socket.on('chat-message', ({ roomId, message }) => {
// //     io.to(roomId).emit('chat-message', message);
// //     console.log(`💬 Chat message sent to room ${roomId}: ${message}`);
// //   });

// //   // Handle user disconnect
// //   socket.on('disconnect', () => {
// //     const roomId = users[socket.id];
// //     if (roomId) {
// //       socket.leave(roomId);
// //       console.log(`❌ User ${socket.id} disconnected from room ${roomId}`);
// //       delete users[socket.id];
// //     }
// //   });
// // });

// // // Default route
// // app.get('/', (req, res) => {
// //   console.log('🔁 GET request to /');
// //   res.send('Backend is running!');
// // });

// // // Start the server
// // const PORT = process.env.PORT || 5000;
// // server.listen(PORT, () => {
// //   console.log(`🚀 Server running on http://localhost:${PORT}`);
// // });

require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const communityRoutes = require('./routes/communityRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorHandler = require('./middleware/errorHandler');
const User = require('./models/User');
const Community = require('./models/Community');
const Post = require('./models/Post');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Store connected users and their rooms
const users = {};

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication Middleware (JWT-based)
const authMiddleware = (req, res, next) => {
  const token = req.headers['x-auth-token'];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/posts', authMiddleware, postRoutes);
app.use('/api/communities', authMiddleware, communityRoutes);
app.use('/api/comments', authMiddleware, commentRoutes);

// User Routes
app.get('/api/user', authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

app.put('/api/user/follow', authMiddleware, async (req, res, next) => {
  const { community } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.following = user.following.includes(community)
      ? user.following.filter(c => c !== community)
      : [...user.following, community];
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Community Routes
app.get('/api/communities', authMiddleware, async (req, res, next) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    next(error);
  }
});

app.post('/api/communities', authMiddleware, async (req, res, next) => {
  const { name } = req.body;
  try {
    if (!name) return res.status(400).json({ message: 'Community name is required' });
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) return res.status(400).json({ message: 'Community already exists' });
    const community = new Community({ name, creator: req.user.username });
    await community.save();
    res.status(201).json(community);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/communities/:name', authMiddleware, async (req, res, next) => {
  try {
    const community = await Community.findOne({ name: req.params.name });
    if (!community) return res.status(404).json({ message: 'Community not found' });
    if (community.creator !== req.user.username) return res.status(403).json({ message: 'Not authorized' });
    await Community.deleteOne({ name: req.params.name });
    await Post.deleteMany({ category: req.params.name });
    res.json({ message: 'Community deleted' });
  } catch (error) {
    next(error);
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  const token = socket.handshake.query.token;
  if (!token) {
    console.log('No token provided, disconnecting socket');
    return socket.disconnect();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded.user;
    console.log(`✅ User connected: ${socket.user.username} (Socket ID: ${socket.id})`);

    socket.on('join-room', (roomId) => {
      socket.join(roomId);
      users[socket.id] = roomId;
      console.log(`User ${socket.user.username} joined room: ${roomId}`);
      socket.broadcast.to(roomId).emit('user-joined', socket.user.username);
    });

    socket.on('offer', (data) => {
      const offerData = {
        ...data.offer,
        username: socket.user.username, // Attach sender's username
      };
      console.log(`Broadcasting offer from ${socket.user.username} to room ${data.roomId}`);
      socket.broadcast.to(data.roomId).emit('offer', offerData);
    });

    socket.on('answer', (data) => {
      const answerData = {
        ...data.answer,
        username: socket.user.username, // Attach sender's username
      };
      console.log(`Broadcasting answer from ${socket.user.username} to room ${data.roomId}`);
      socket.broadcast.to(data.roomId).emit('answer', answerData);
    });

    socket.on('ice-candidate', (data) => {
      const candidateData = {
        candidate: data.candidate,
        username: socket.user.username, // Attach sender's username
      };
      console.log(`Broadcasting ICE candidate from ${socket.user.username} to room ${data.roomId}`);
      socket.broadcast.to(data.roomId).emit('ice-candidate', candidateData);
    });

    socket.on('chat-message', (data) => {
      const messageWithUsername = {
        username: socket.user.username,
        message: data.message,
      };
      console.log(`Broadcasting chat message from ${socket.user.username} to room ${data.roomId}`);
      io.to(data.roomId).emit('chat-message', messageWithUsername);
    });

    socket.on('disconnect', () => {
      const roomId = users[socket.id];
      if (roomId) {
        console.log(`User ${socket.user.username} disconnected from room: ${roomId}`);
        socket.broadcast.to(roomId).emit('user-left', socket.user.username);
        delete users[socket.id];
      } else {
        console.log(`User ${socket.user.username} disconnected (no room assigned)`);
      }
    });
  } catch (err) {
    console.log('Invalid token:', err.message);
    socket.disconnect();
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Error Handling Middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));