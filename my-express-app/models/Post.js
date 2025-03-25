// const express = require('express');
// const router = express.Router();
// const auth = require('../config/auth');
// const Post = require('../models/Post');
// const User = require('../models/User');

// router.get('/', auth, async (req, res) => {
//   try {
//     const posts = await Post.find().populate('user', ['username']);
//     res.json(posts);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.get('/trending', auth, async (req, res) => {
//   try {
//     const posts = await Post.find()
//       .sort({ upvotes: -1 })
//       .limit(10)
//       .populate('user', ['username']);
//     res.json(posts);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// router.post('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     const newPost = new Post({
//       ...req.body,
//       user: req.user.id,
//     });
//     const post = await newPost.save();
//     res.json(post);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;

// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  media: { type: String }, // Store file path or URL
  category: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);