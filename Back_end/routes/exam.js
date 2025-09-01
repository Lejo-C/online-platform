const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const ScheduledExam = require('../models/ScheduledExam');
const QuestionBank = require('../models/QuestionBank');

// Create exam
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
  if (!exam) return res.status(404).json({ message: 'Exam not found' });

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

// Get filtered questions
router.get('/:id/questions', async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    const filtered = exam.questions.filter(q =>
      q.type === exam.type && q.difficulty === exam.difficulty
    );
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, exam.questionCount || 10);

    res.json({ questions: selected });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete exam
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

// Schedule an exam
router.post('/schedule', async (req, res) => {
  const { examId, username, date, time, duration } = req.body;

  if (!examId || !username || !date || !time || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const scheduledAt = new Date(`${date}T${time}`);
  const now = new Date();

  if (scheduledAt < now) {
    return res.status(400).json({ error: 'Scheduled time must be in the future' });
  }

  try {
    const existing = await ScheduledExam.findOne({ examId, username });
    if (existing) {
      return res.status(409).json({ error: 'Exam already scheduled for this user' });
    }

    const scheduled = new ScheduledExam({
      examId: new mongoose.Types.ObjectId(examId),
      username,
      scheduledAt,
      duration: Number(duration)
    });

    await scheduled.save();
    res.status(200).json({ message: 'Scheduled successfully' });
  } catch (err) {
    console.error('Error scheduling exam:', err);
    res.status(500).json({ error: 'Server error while scheduling exam' });
  }
});

// Get scheduled exams for a user
router.get('/scheduled', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username is required' });

  try {
    const scheduled = await ScheduledExam.find({ username }).sort({ scheduledAt: 1 });
    res.status(200).json(scheduled);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Student requests approval
router.post('/request-approval', async (req, res) => {
  const { examId, username } = req.body;

  const scheduled = await ScheduledExam.findOne({ examId, username });
  if (!scheduled) return res.status(404).json({ error: 'No scheduled exam found' });

  const existing = await PendingApproval.findOne({ examId, username });
  if (existing) return res.status(409).json({ error: 'Approval already requested' });

  await PendingApproval.create({
    examId,
    username,
    scheduledAt: scheduled.scheduledAt,
    duration: scheduled.duration
  });

  res.status(200).json({ message: 'Approval request sent' });
});

// Admin fetches pending approvals
router.get('/pending-approvals', async (req, res) => {
  const pending = await PendingApproval.find({ status: 'pending' });
  res.json(pending);
});

// Admin approves or declines
router.post('/update-approval', async (req, res) => {
  const { examId, username, status } = req.body;
  if (!['approved', 'declined'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  await PendingApproval.findOneAndUpdate({ examId, username }, { status });
  res.status(200).json({ message: `Request ${status}` });
});

router.post('/create-exam', async (req, res) => {
  const { name, type, difficulty, topic, questionCount } = req.body;

  try {
    const questions = await QuestionBank.find({
      type,
      difficulty,
      topic
    }).limit(questionCount || 10);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No matching questions found in question bank' });
    }

    const newExam = new Exam({
      name,
      type,
      difficulty,
      createdBy: 'admin',
      questions
    });

    await newExam.save();
    res.status(201).json({ message: 'Exam created!', exam: newExam });
  } catch (err) {
    res.status(500).json({ message: 'Error creating exam', error: err });
  }
});

module.exports = router;
