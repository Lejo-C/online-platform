const express = require('express');
const router = express.Router();
const Exam = require('../models/Exam');
const mongoose = require('mongoose');

// Create exam (admin)
router.post('/create-exam', async (req, res) => {
  try {
    const newExam = new Exam(req.body);
    await newExam.save();
    res.status(201).json({ message: 'Exam created!', exam: newExam });
  } catch (err) {
    res.status(500).json({ message: 'Error creating exam', error: err });
  }
});

// Get all exams
router.get('/', async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching exams', error: err.message });
  }
});

// Submit exam attempt
router.post('/submit/:id', async (req, res) => {
  const { answers } = req.body;
  const exam = await Exam.findById(req.params.id);
  let score = 0;
  const feedback = [];

  exam.questions.forEach((q, i) => {
    const studentAns = answers[i];
    const correct = q.correctAnswer;

    if (String(studentAns).toLowerCase() === String(correct).toLowerCase()) {
      score++;
    } else {
      feedback.push({ question: q.text, correctAnswer: correct, yourAnswer: studentAns });
    }
  });

  res.json({ score, total: exam.questions.length, feedback });
});
router.get('/:id/questions', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const filtered = exam.questions.filter(q =>
      q.type === exam.type && q.difficulty === exam.difficulty
    );
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, exam.questionCount || 10);

    res.json(selected);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

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
    res.status(500).json({ error: 'Server error while deleting exam' });
  }
});
module.exports = router;
