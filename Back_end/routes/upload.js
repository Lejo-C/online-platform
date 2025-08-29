const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.put('/upload-profile-image', async (req, res) => {
  const { email, image } = req.body;

  if (!email || !image) {
    return res.status(400).json({ message: 'Email and image required' });
  }

  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { imageURL: image },
      { new: true }
    );

    res.status(200).json({ message: 'Image saved', imageURL: updatedUser.imageURL });
  } catch (error) {
    console.error('Upload failed:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
});

module.exports = router;
