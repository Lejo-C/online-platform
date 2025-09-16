const mongoose = require('mongoose');

const PendingApprovalSchema = new mongoose.Schema({
  examId: mongoose.Types.ObjectId,
  username: String,
  duration: Number,
  scheduledAt: Date,
  
  status: { type: String, default: 'pending' } // 'pending', 'approved', 'declined'
});

module.exports = mongoose.model('PendingApproval', PendingApprovalSchema);
