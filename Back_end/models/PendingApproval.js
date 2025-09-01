const mongoose = require('mongoose');

const PendingApprovalSchema = new mongoose.Schema({
  examId: mongoose.Types.ObjectId,
  username: String,
  scheduledAt: Date,
  duration: Number,
  status: { type: String, default: 'pending' } // 'pending', 'approved', 'declined'
});

module.exports = mongoose.model('PendingApproval', PendingApprovalSchema);
