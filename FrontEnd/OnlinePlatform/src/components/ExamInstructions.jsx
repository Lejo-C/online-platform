import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamInstructions = () => {
  const { id } = useParams(); // examId from URL
  const [exam, setExam] = useState(null);
  const [scheduledEntry, setScheduledEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem('username');

    // Fetch exam metadata
    axios.get(`http://localhost:3000/exams/${id}`)
      .then(res => setExam(res.data))
      .catch(err => {
        console.error('Error fetching exam:', err);
        alert('Failed to load exam details');
      });

    // Fetch scheduled entry for this student
    axios.get(`http://localhost:3000/exams/scheduled?username=${username}`)
      .then(res => {
        const match = res.data.find(s => String(s.examId) === String(id));
        setScheduledEntry(match || null);
      })
      .catch(err => {
        console.error('Error fetching scheduled entry:', err);
        setScheduledEntry(null);
      });
  }, [id]);

  const handleContinue = async () => {
    const username = localStorage.getItem('username');

    try {
      await axios.post('http://localhost:3000/exams/mark-attempted', {
        examId: id,
        username
      });
      navigate(`/attempt/${id}`);
    } catch (err) {
      console.error('Error marking exam as attempted:', err);
      alert('❌ Failed to mark exam as attempted');
    }
  };

  if (!exam) return <p className="p-6 text-gray-600">Loading exam instructions...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">{exam.name}</h1>
        <p className="text-gray-600 mb-2"><strong>Type:</strong> {exam.type}</p>
        <p className="text-gray-600 mb-2"><strong>Difficulty:</strong> {exam.difficulty}</p>
        <p className="text-gray-600 mb-6">
          <strong>Duration:</strong>{' '}
          {scheduledEntry?.duration
            ? `${scheduledEntry.duration} minutes`
            : 'Not scheduled'}
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Instructions</h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>Ensure a stable internet connection throughout the exam.</li>
          <li>Do not refresh or close the browser tab once the exam begins.</li>
          <li>Each question may be timed or auto-submitted after the duration ends.</li>
          <li>Use of external resources or assistance is strictly prohibited.</li>
          <li>Click “Submit” only when you’ve completed all questions.</li>
        </ul>

        <button
          onClick={handleContinue}
          className="bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 w-full font-semibold"
        >
          Continue to Exam
        </button>
      </div>
    </div>
  );
};

export default ExamInstructions;
