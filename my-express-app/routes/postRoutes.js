// routes/postRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/authMiddleware');
const Post = require('../models/Post');
const Community = require('../models/Community');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize Multer instance
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif) are allowed'));
    }
  },
});

// Get all posts
router.get('/', auth, async (req, res, next) => {
  try {
    const posts = await Post.find().populate('user', 'username');
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    next(error); // Pass to errorHandler
  }
});

// Get trending posts (sorted by upvotes)
router.get('/trending', auth, async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('user', 'username')
      .sort({ 'upvotes.length': -1 }) // Sort by number of upvotes
      .limit(10);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching trending posts:', error.message);
    next(error);
  }
});

// Create a post
router.post('/', auth, upload.single('media'), async (req, res, next) => {
  const { title, content, category } = req.body;
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const newPost = new Post({
      title,
      content,
      category: category || 'General',
      user: req.user.id,
      media: req.file ? `/uploads/${req.file.filename}` : null,
    });
    const post = await newPost.save();
    await post.populate('user', 'username');
    res.status(201).json(post);
  } catch (error) {
    console.error('Post creation error:', error.message);
    if (error.message.includes('Only images')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

// Upvote a post
router.put('/:id/upvote', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    if (post.upvotes.includes(userId)) {
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
    } else {
      post.upvotes.push(userId);
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
    }
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'username');
    res.json(populatedPost);
  } catch (error) {
    console.error('Upvote error:', error.message);
    next(error);
  }
});

// Downvote a post
router.put('/:id/downvote', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user.id;
    if (post.downvotes.includes(userId)) {
      post.downvotes = post.downvotes.filter(id => id.toString() !== userId.toString());
    } else {
      post.downvotes.push(userId);
      post.upvotes = post.upvotes.filter(id => id.toString() !== userId.toString());
    }
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'username');
    res.json(populatedPost);
  } catch (error) {
    console.error('Downvote error:', error.message);
    next(error);
  }
});

// Add a comment
router.post('/:id/comments', auth, async (req, res, next) => {
  const { text } = req.body;
  try {
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ user: req.user.id, text });
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'username');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Comment error:', error.message);
    next(error);
  }
});

// Delete a post
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const community = await Community.findOne({ name: post.category });
    const isCommunityCreator = community && community.creator === req.user.username;
    if (post.user.toString() !== req.user.id && !isCommunityCreator) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error.message);
    next(error);
  }
});

// Update a post
router.put('/:id', auth, upload.single('media'), async (req, res, next) => {
  const { title, content } = req.body;
  console.log('Request body:', req.body);
  console.log('Uploaded file:', req.file);

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    if (req.file) {
      post.media = `/uploads/${req.file.filename}`;
    }
    await post.save();
    const populatedPost = await Post.findById(post._id).populate('user', 'username');
    res.json(populatedPost);
  } catch (error) {
    console.error('Post update error:', error.message);
    if (error.message.includes('Only images')) {
      return res.status(400).json({ message: error.message });
    }
    next(error);
  }
});

module.exports = router;