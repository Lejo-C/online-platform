import React, { useState } from 'react';
import axios from 'axios';

const CreatExam = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('mcq');
  const [difficulty, setDifficulty] = useState('easy');
  const [questionCount, setQuestionCount] = useState(10);
  const [questions, setQuestions] = useState([]);

  // Add new question block
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        type: 'mcq',
        text: '',
        options: ['', '', '', ''],
        correctAnswer: ''
      }
    ]);
  };

  // Update question text, type, or options
  const handleQuestionChange = (index, field, value) => {
    const updated = [...questions];
    if (field === 'options') {
      updated[index].options = value;
    } else {
      updated[index][field] = value;
    }
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        type,
        difficulty,
        questionCount,
        createdBy: 'admin',
        questions
      };
      await axios.post('http://localhost:3000/exams/create-exam', payload);
      alert('✅ Exam created successfully!');
      setName('');
      setType('mcq');
      setDifficulty('easy');
      setQuestionCount(10);
      setQuestions([]);
    } catch (err) {
      console.error('Error creating exam:', err);
      alert('❌ Failed to create exam');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow space-y-6 mt-10"
    >
      <h2 className="text-2xl font-bold text-gray-800 text-center">📝 Create New Exam</h2>

      <input
        className="w-full p-2 border rounded"
        placeholder="Exam Name"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <select
        value={type}
        onChange={e => setType(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="mcq">MCQ</option>
        <option value="fill">Fill in the Blanks</option>
        <option value="truefalse">True or False</option>
      </select>

      <select
        value={difficulty}
        onChange={e => setDifficulty(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <input
        type="number"
        min="1"
        placeholder="Number of Questions"
        value={questionCount}
        onChange={e => setQuestionCount(Number(e.target.value))}
        className="w-full p-2 border rounded"
      />

      {/* Question Blocks */}
      <div className="space-y-4">
        <button
          type="button"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={addQuestion}
        >
          ➕ Add Question
        </button>

        {questions.map((q, index) => (
          <div key={index} className="bg-gray-100 p-4 rounded-lg">
            <input
              className="w-full p-2 mb-2 border rounded"
              placeholder={`Question ${index + 1}`}
              value={q.text}
              onChange={e => handleQuestionChange(index, 'text', e.target.value)}
            />
            {q.options.map((opt, i) => (
              <input
                key={i}
                className="w-full p-2 mb-1 border rounded"
                placeholder={`Option ${i + 1}`}
                value={opt}
                onChange={e => {
                  const updatedOptions = [...q.options];
                  updatedOptions[i] = e.target.value;
                  handleQuestionChange(index, 'options', updatedOptions);
                }}
              />
            ))}
            <input
              className="w-full p-2 mt-2 border rounded"
              placeholder="Correct Answer"
              value={q.correctAnswer}
              onChange={e => handleQuestionChange(index, 'correctAnswer', e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded"
      >
        ✅ Create Exam
      </button>
    </form>
  );
};

export default CreatExam;
