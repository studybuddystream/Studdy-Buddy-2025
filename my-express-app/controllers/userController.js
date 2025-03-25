const User = require('../models/User');

const followCommunity = async (req, res) => {
  const { community } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.following = user.following.includes(community)
      ? user.following.filter(c => c !== community)
      : [...user.following, community];
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { followCommunity };