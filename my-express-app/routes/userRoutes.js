// // const express = require('express');
// // const User = require('../models/User');
// // const router = express.Router();
// // const { followCommunity } = require('../controllers/userController');
// // const authMiddleware = require('../middleware/authMiddleware');

// // router.put('/follow', authMiddleware, followCommunity);

// // module.exports = router;

// // // Signup Route
// // router.post('/signup', async (req, res) => {
// //   const { name, email, password } = req.body;

// //   // Log the incoming request
// //   console.log('Signup request received:', { name, email });

// //   // Validate input
// //   if (!name || !email || !password) {
// //     console.error('Validation failed: Missing fields');
// //     return res.status(400).json({ message: 'Please fill in all fields.' });
// //   }

// //   if (!/\S+@\S+\.\S+/.test(email)) {
// //     console.error('Validation failed: Invalid email');
// //     return res.status(400).json({ message: 'Please enter a valid email address.' });
// //   }

// //   if (password.length < 6) {
// //     console.error('Validation failed: Password too short');
// //     return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
// //   }

// //   try {
// //     // Check if the user already exists
// //     const existingUser = await User.findOne({ email });
// //     if (existingUser) {
// //       console.error('Signup failed: User already exists');
// //       return res.status(400).json({ message: 'User already exists.' });
// //     }

// //     // Create a new user
// //     const user = new User({ name, email, password });
// //     await user.save();

// //     // Log successful signup
// //     console.log('User created successfully:', { id: user._id, name: user.name, email: user.email });

// //     // Respond with the created user (excluding the password)
// //     res.status(201).json({ user: { id: user._id, name: user.name, email: user.email } });
// //   } catch (error) {
// //     console.error('Signup error:', error);
// //     res.status(500).json({ message: 'Signup failed. Please try again.' });
// //   }
// // });

// // // Login Route
// // router.post('/login', async (req, res) => {
// //   const { email, password } = req.body;

// //   // Log the incoming request
// //   console.log('Login request received:', { email });

// //   // Validate input
// //   if (!email || !password) {
// //     console.error('Validation failed: Missing fields');
// //     return res.status(400).json({ message: 'Please fill in all fields.' });
// //   }

// //   try {
// //     // Find the user by email
// //     const user = await User.findOne({ email });
// //     if (!user) {
// //       console.error('Login failed: User not found');
// //       return res.status(400).json({ message: 'Invalid credentials.' });
// //     }

// //     // Check the password (you should use bcrypt for hashing in a real app)
// //     if (user.password !== password) {
// //       console.error('Login failed: Invalid password');
// //       return res.status(400).json({ message: 'Invalid credentials.' });
// //     }

// //     // Log successful login
// //     console.log('Login successful:', { id: user._id, name: user.name, email: user.email });

// //     // Respond with the user (excluding the password)
// //     res.json({ user: { id: user._id, name: user.name, email: user.email } });
// //   } catch (error) {
// //     console.error('Login error:', error);
// //     res.status(500).json({ message: 'Login failed. Please try again.' });
// //   }
// // });

// // module.exports = router;


// // routes/userRoutes.js
// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const User = require('../models/User');

// // Follow/unfollow a community
// router.put('/follow', authMiddleware, async (req, res) => {
//   const { community } = req.body;
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.following = user.following.includes(community)
//       ? user.following.filter(c => c !== community)
//       : [...user.following, community];
//     await user.save();
//     res.json(user);
//   } catch (error) {
//     console.error('Follow error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;

// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const User = require('../models/User');

// Follow/unfollow a community
router.put('/follow', auth, async (req, res) => {
  const { community } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.following.includes(community)) {
      user.following = user.following.filter(c => c !== community);
    } else {
      user.following.push(community);
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;