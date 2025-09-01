import { useState } from 'react';
import axios from 'axios';

const CreateExam = () => {
  const [name, setName] = useState('');
  const [type, setType] = useState('mcq');
  const [difficulty, setDifficulty] = useState('easy');
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);

  const handleCreateExam = () => {
    axios.post('http://localhost:3000/exams/create-exam', {
  name,
  type,
  difficulty,
  topic,
  questionCount: count
})
.then(() => {
      alert('✅ Exam created successfully!');
    }).catch(err => {
      console.error('Error creating exam:', err);
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">Create Exam</h2>

      <input
        type="text"
        placeholder="Exam Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <select value={type} onChange={e => setType(e.target.value)} className="w-full p-2 border rounded mb-4">
        <option value="mcq">MCQ</option>
        <option value="truefalse">True/False</option>
        <option value="fillblank">Fill in the Blank</option>
      </select>

      <select value={difficulty} onChange={e => setDifficulty(e.target.value)} className="w-full p-2 border rounded mb-4">
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <input
        type="text"
        placeholder="Topic"
        value={topic}
        onChange={e => setTopic(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <input
        type="number"
        placeholder="Number of Questions"
        value={count}
        onChange={e => setCount(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <button
        onClick={handleCreateExam}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition font-semibold"
      >
        Create Exam
      </button>
    </div>
  );
};

export default CreateExam;
