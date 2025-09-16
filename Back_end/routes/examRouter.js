const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Exam = require('../models/Exam');

// ✅ GET all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching exams', error: err.message });
  }
});

// ✅ GET available subjects
router.get('/subjects', (req, res) => {
  res.json(['Math', 'Science', 'History', 'English', 'Computer']);
});

// ✅ DELETE exam by ID with ObjectId validation
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid exam ID format' });
  }

  try {
    const deletedExam = await Exam.findByIdAndDelete(id);

    if (!deletedExam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.status(200).json({ message: 'Exam deleted successfully', exam: deletedExam });
  } catch (err) {
    console.error('Error deleting exam:', err);
    res.status(500).json({ error: 'Server error while deleting exam' });
  }
});

module.exports = router;
