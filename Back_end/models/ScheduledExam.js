const mongoose = require('mongoose');

const ScheduledExamSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam' },
  username: String,
  scheduledAt: Date,
  status: { type: String, default: 'pending' },
  duration: { type: Number, required: true }

});

module.exports = mongoose.model('ScheduledExam', ScheduledExamSchema);
