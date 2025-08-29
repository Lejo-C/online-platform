const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  text: String,
  options: [String],           // For MCQ
  correctAnswer: String,
  type: String,                // 'mcq', 'fill', 'truefalse'
  difficulty: String,          // 'easy', 'medium', 'hard'
});

module.exports = mongoose.model('Question', QuestionSchema);
