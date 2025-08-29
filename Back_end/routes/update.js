const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.put('/update-profile', async (req, res) => {
  const { currentEmail, username, email, gender, password } = req.body;

  try {
    const updateData = {
      username,
      email,
      gender
    };

    if (password && password.trim() !== '') {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: currentEmail },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      message: 'Profile updated successfully',
      username: updatedUser.username,
      email: updatedUser.email,
      gender: updatedUser.gender,
      role: updatedUser.role
    });
  } catch (error) {
    console.error('Update failed:', error);
    res.status(500).json({ message: 'Server error during update' });
  }
});

module.exports = router;
