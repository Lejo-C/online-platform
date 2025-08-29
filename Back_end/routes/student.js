const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all students
router.get('/students', async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (err) {
    console.error('❌ Error fetching students:', err);
    res.status(500).json({ message: 'Server error while fetching students' });
  }
});

module.exports = router;
