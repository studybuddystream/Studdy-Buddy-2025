const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// GET /api/posts - Fetch all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by newest first
    res.json(posts);
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json({ message: 'Failed to fetch posts' });
  }
});

// GET /api/posts/trending - Fetch trending posts
router.get('/trending', async (req, res) => {
  try {
    const trendingPosts = await Post.find()
      .sort({ upvotes: -1 }) // Sort by upvotes (descending)
      .limit(5); // Get top 5 trending posts
    res.json(trendingPosts);
  } catch (err) {
    console.error('Error fetching trending posts:', err);
    res.status(500).json({ message: 'Failed to fetch trending posts' });
  }
});

// POST /api/posts - Create a new post
router.post('/', async (req, res) => {
  try {
    const { title, content, category, hashtags, user } = req.body;

    // Validate required fields
    if (!title || !content || !category || !user) {
      return res.status(400).json({ message: 'Title, content, category, and user are required' });
    }

    // Create a new post
    const newPost = new Post({
      title,
      content,
      category,
      hashtags: hashtags || [],
      user,
    });

    // Save the post to the database
    await newPost.save();
    res.status(201).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(500).json({ message: 'Failed to create post' });
  }
});

module.exports = router;