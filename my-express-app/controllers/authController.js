// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcrypt'); // Use 'bcrypt' to match server.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use .env

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    console.error('Signup validation failed: Missing fields', { name, email, password });
    return res.status(400).json({ message: 'Name, email, and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error('Signup failed: Email already exists', { email });
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({ username: name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { user: { id: user._id, username: user.username } },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Signup successful:', { id: user._id, username: user.username, email });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    console.error('Signin validation failed: Missing fields', { email });
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('Signin failed: User not found', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Signin failed: Invalid password', { email });
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { user: { id: user._id, username: user.username } },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    console.log('Signin successful:', { id: user._id, username: user.username, email });
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};