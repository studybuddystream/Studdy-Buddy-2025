const Post = require('../models/Post');

const createPost = async (req, res) => {
  const { title, content, category } = req.body;
  try {
    const post = new Post({
      title,
      content,
      category,
      media: req.file ? `/uploads/${req.file.filename}` : null,
      user: req.user.userId,
    });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.user.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    await post.remove();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createPost, deletePost };