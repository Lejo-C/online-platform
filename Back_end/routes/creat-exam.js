const express = require('express');
const router = express.Router();

// POST: /create-exam
router.post('/create-exam', async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(201).json({ message: 'Exam created', exam: newExam });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ error: 'Failed to create exam' });
  }
});


module.exports = router;
