const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

// ✅ Signup Route
router.post('/', async (req, res) => {
  const { username, email, password, role, gender } = req.body;

  if (!username || !email || !password || !role || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // ❌ Reject Gmail addresses containing "admin"
  const isGmail = email.toLowerCase().endsWith('@gmail.com');
  const containsAdmin = email.toLowerCase().includes('admin');
  if (isGmail && containsAdmin) {
    return res.status(400).json({ message: 'Invalid email: Gmail addresses cannot contain "admin"' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
      gender
    });

    await newUser.save();
    console.log('✅ New user created:', newUser.email);

    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// ✅ Signin Route
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password mismatch for:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('✅ User logged in:', email);

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
      console.log('❌ Image save failed — user not found:', email);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('✅ Image updated for:', email);

    res.status(200).json({ message: 'Image saved', imageURL: updatedUser.imageURL });
  } catch (err) {
    console.error('❌ Image save error:', err);
    res.status(500).json({ message: 'Failed to save image' });
  }
});

module.exports = router;
