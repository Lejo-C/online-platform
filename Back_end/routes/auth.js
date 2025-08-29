const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
// ✅ Signup Route
router.post('/', async (req, res) => {
  const { username, email, password, role, gender } = req.body;

  if (!username || !email || !password || !role || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const newUser = new User({ username, email, password, role, gender });
    await newUser.save(); 

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});


router.post('/signin', async (req, res) =>  {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({
      message: 'Login successful',
      role: user.role,
      username: user.username,
      email: user.email,
      gender: user.gender,
      imageURL: user.imageURL
    });
  } catch (err) {
    console.error('❌ Signin error:', err);
    res.status(500).json({ message: 'Server error during signin' });
  }
});

// ✅ Save Base64 Image
router.put('/save-base64-image', async (req, res) => {
  const { email, image } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { imageURL: image },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Image saved', imageURL: updatedUser.imageURL });
  } catch (err) {
    console.error('❌ Image save error:', err);
    res.status(500).json({ message: 'Failed to save image' });
  }
});

module.exports = router;
