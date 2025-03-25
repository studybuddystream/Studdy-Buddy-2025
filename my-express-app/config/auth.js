// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs'); // Should be 'bcryptjs', not 'bcrypt'
// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     let user = await User.findOne({ username });
//     if (user) return res.status(400).json({ msg: 'User already exists' });

//     user = new User({ username, password });
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(password, salt);
//     await user.save();

//     const payload = { user: { id: user.id } };
//     const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // ... (rest of the file, e.g., /login route)

// module.exports = router;

const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };