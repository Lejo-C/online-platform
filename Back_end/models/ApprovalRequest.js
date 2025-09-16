const mongoose = require('mongoose');

const approvalRequestSchema = new mongoose.Schema({
  examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  username: { type: String, required: true },
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }

});

module.exports = mongoose.model('ApprovalRequest', approvalRequestSchema);
