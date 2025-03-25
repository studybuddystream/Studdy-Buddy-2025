// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: 'New to StudyBuddy' },
  following: { type: [String], default: ['General'] },
  bookmarks: { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);