import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Examviewer = () => {
  const [exams, setExams] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/exams')
      .then(res => {
        const filtered = res.data.filter(e => e.createdBy === 'admin');
        setExams(filtered);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Available Exams</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam._id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">{exam.name}</h2>
            <p className="text-sm text-gray-500 mb-4">Type: {exam.type}, Difficulty: {exam.difficulty}</p>
            <button
              onClick={() => navigate(`/attempt/${exam._id}`)}
              className="bg-indigo-500 text-white py-2 px-4 rounded hover:bg-indigo-600 font-medium w-full"
            >
              Attempt Exam
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Examviewer;
