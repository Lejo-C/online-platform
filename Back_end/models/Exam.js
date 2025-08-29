const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'truefalse', 'fillblank'],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    default: []
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  }
});

const examSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['mcq', 'truefalse', 'fillblank'],
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  questionCount: {
    type: Number,
    default: 10,
    min: 1
  },
  questions: {
    type: [questionSchema],
    default: []
  }
});

module.exports = mongoose.model('Exam', examSchema);
