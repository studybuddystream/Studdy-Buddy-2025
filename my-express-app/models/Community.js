// models/Community.js
const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  creator: { type: String, required: true }, // Could be ObjectId ref to User if needed
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Community', communitySchema);