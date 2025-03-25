// routes/communityRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const Community = require('../models/Community');
const Post = require('../models/Post');

// Get all communities
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a community
router.post('/', auth, async (req, res) => {
  const { name } = req.body;
  try {
    const existingCommunity = await Community.findOne({ name });
    if (existingCommunity) return res.status(400).json({ message: 'Community already exists' });

    const community = new Community({
      name,
      creator: req.user.username, // Assuming username is in the token
    });
    await community.save();
    res.status(201).json(community);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a community
router.delete('/:name', auth, async (req, res) => {
  try {
    const community = await Community.findOne({ name: req.params.name });
    if (!community) return res.status(404).json({ message: 'Community not found' });

    if (community.creator !== req.user.username) {
      return res.status(403).json({ message: 'Not authorized to delete this community' });
    }

    await Community.deleteOne({ name: req.params.name });
    await Post.deleteMany({ category: req.params.name }); // Delete all posts in this community
    res.json({ message: 'Community deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;