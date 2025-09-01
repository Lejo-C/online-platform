const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: String,
  type: { type: String, enum: ['mcq', 'truefalse', 'fillblank'], required: true },
  options: [String], // for MCQ only
  correctAnswer: mongoose.Schema.Types.Mixed,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
  topic: String,
  examType: String // optional: 'midterm', 'final', etc.
});

module.exports = mongoose.model('QuestionBank', QuestionSchema);
