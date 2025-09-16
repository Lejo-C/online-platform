const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Exam = require('../models/Exam');
const ScheduledExam = require('../models/ScheduledExam'); // adjust path if needed

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

router.get('/scheduled', async (req, res) => {
  const { username } = req.query;
  try {
    const scheduledExams = await ScheduledExam.find({ username }); // or your model name
    res.json(scheduledExams); // ✅ must return an array
  } catch (err) {
    console.error('Error fetching scheduled exams:', err);
    res.status(500).json({ error: 'Failed to fetch scheduled exams' });
  }
});


// ✅ CREATE exam with createdBy field
router.post('/create-exam', async (req, res) => {
  try {
    const examData = {
      ...req.body,
      createdBy: 'admin' // ✅ Ensures visibility in Examviewer
    };
    const newExam = new Exam(examData);
    await newExam.save();
    res.status(201).json({ message: 'Exam created', exam: newExam });
  } catch (err) {
    console.error('Error creating exam:', err);
    res.status(500).json({ error: 'Failed to create exam' });
  }
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

// ✅ Schedule an exam for a student
router.post('/schedule', async (req, res) => {
  const { examId, username, date, time, duration } = req.body;

  if (!examId || !username || !date || !time || !duration) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const scheduledAt = new Date(`${date}T${time}`);

  try {
    const newSchedule = new ScheduledExam({
      examId,
      username,
      scheduledAt,
      duration
    });

    await newSchedule.save();
    res.status(201).json({ message: 'Scheduled successfully' });
  } catch (err) {
    console.error('Error scheduling exam:', err);
    res.status(500).json({ error: 'Server error while scheduling exam' });
  }
});

const ApprovalRequest = require('../models/ApprovalRequest'); // create this model

router.post('/request-approval', async (req, res) => {
  const { examId, username } = req.body;

  const existing = await ApprovalRequest.findOne({ examId, username });
  if (existing) return res.status(409).json({ error: 'Already requested' });

  const request = new ApprovalRequest({
    examId,
    username,
    requestedAt: new Date(),
    status: 'pending'
  });

  await request.save();
  res.status(201).json({ message: 'Approval request sent' });
});

router.post('/approve', async (req, res) => {
  const { id, status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  try {
    await ApprovalRequest.findByIdAndUpdate(id, { status });
    res.status(200).json({ message: 'Request updated' });
  } catch (err) {
    console.error('Error updating approval:', err);
    res.status(500).json({ error: 'Failed to update request' });
  }
});

router.get('/approval-requests', async (req, res) => {
  try {
    const requests = await ApprovalRequest.find()
      .populate('examId', 'name') // get exam name
      .sort({ requestedAt: -1 }); // newest first

    res.json(requests);
  } catch (err) {
    console.error('Error fetching approval requests:', err);
    res.status(500).json({ error: 'Failed to fetch approval requests' });
  }
});

router.get('/approval-status', async (req, res) => {
  const { username } = req.query;
  try {
    const approvals = await ApprovalRequest.find({ username });
    res.json(approvals);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch approval status' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await Exam.findById(id);
    if (!exam) return res.status(404).json({ error: 'Exam not found' });

    res.json(exam);
  } catch (err) {
    console.error('Error fetching exam:', err);
    res.status(500).json({ error: 'Failed to fetch exam' });
  }
});

router.post('/mark-attempted', async (req, res) => {
  const { examId, username } = req.body;

  try {
    await ScheduledExam.findOneAndUpdate(
      { examId, username },
      { attempted: true }
    );
    res.status(200).json({ message: 'Marked as attempted' });
  } catch (err) {
    console.error('Error marking attempt:', err);
    res.status(500).json({ error: 'Failed to mark attempt' });
  }
});


module.exports = router;
