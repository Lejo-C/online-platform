const mongoose = require('mongoose');

const scheduledExamSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  username: { type: String, required: true },
  scheduledAt: { type: Date, required: true },
  duration: { type: Number, required: true },
  attempted: { type: Boolean, default: false }
});

module.exports = mongoose.model('ScheduledExam', scheduledExamSchema);
