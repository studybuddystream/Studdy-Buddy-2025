const Community = require('../models/Community');

const createCommunity = async (req, res) => {
  const { name } = req.body;
  try {
    const community = new Community({ name, creator: req.user.userId });
    await community.save();
    res.json(community);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findOneAndDelete({
      name: req.params.name,
      creator: req.user.userId,
    });
    if (!community) return res.status(404).json({ message: 'Community not found' });
    res.json({ message: 'Community deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createCommunity, deleteCommunity };