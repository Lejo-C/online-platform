const mongoose = require('mongoose');
const QuestionBank = require('../models/QuestionBank');

mongoose.connect('mongodb://localhost:27017/yourdbname');

const questions = [
  // 🧪 Chemistry - MCQ - Easy
  {
    text: "What is the chemical symbol for water?",
    type: "mcq",
    options: ["H2O", "O2", "CO2", "NaCl"],
    correctAnswer: "H2O",
    difficulty: "easy",
    topic: "Chemistry"
  },
  {
    text: "Which acid is found in vinegar?",
    type: "mcq",
    options: ["Citric acid", "Acetic acid", "Sulfuric acid", "Hydrochloric acid"],
    correctAnswer: "Acetic acid",
    difficulty: "easy",
    topic: "Chemistry"
  },
  // Add 3 more Chemistry MCQs (easy)...

  // 🧪 Chemistry - Fill-in-the-blank - Medium
  {
    text: "The atomic number of carbon is ___.",
    type: "fillblank",
    correctAnswer: "6",
    difficulty: "medium",
    topic: "Chemistry"
  },
  // Add 4 more Chemistry fill-in-the-blanks (medium)...

  // 🧪 Chemistry - True/False - Hard
  {
    text: "All noble gases have a complete outer shell of electrons.",
    type: "truefalse",
    correctAnswer: true,
    difficulty: "hard",
    topic: "Chemistry"
  },
  // Add 4 more Chemistry true/false (hard)...

  // 🔬 Physics, 📐 Maths, 📚 English, 🧬 Biology — repeat same structure
];

QuestionBank.insertMany(questions)
  .then(() => {
    console.log("✅ Questions seeded successfully");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Error seeding questions:", err);
  });
