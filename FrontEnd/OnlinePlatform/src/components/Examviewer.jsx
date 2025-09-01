import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Examviewer = () => {
  const [exams, setExams] = useState([]);
  const [scheduledExams, setScheduledExams] = useState({});
  const [scheduled, setScheduled] = useState([]);
  const navigate = useNavigate();

  // Fetch scheduled exams for the logged-in student
  useEffect(() => {
    const username = localStorage.getItem('username');
    axios.get(`http://localhost:3000/exams/scheduled?username=${username}`)
      .then(res => setScheduled(res.data))
      .catch(err => console.error('Error fetching scheduled exams:', err));
  }, []);

  // Fetch all available exams
  useEffect(() => {
    axios.get('http://localhost:3000/exams')
      .then(res => {
        const filtered = res.data.filter(e => e.createdBy === 'admin');
        setExams(filtered);
      });
  }, []);

  // Handle scheduling submission
  const handleSchedule = async (examId) => {
    const schedule = scheduledExams[examId];
if (!schedule?.date || !schedule?.time || !schedule?.duration) {
  alert('Please select date, time, and duration');
  return;
}

  try {
    await axios.post(`http://localhost:3000/exams/schedule`, {
  examId,
  username: localStorage.getItem('username'),
  date: schedule.date,
  time: schedule.time,
  duration: schedule.duration
    });
    alert('✅ Exam scheduled successfully!');
  } catch (err) {
    console.error('Scheduling failed:', err);
    if (err.response?.status === 400) {
      alert('❌ Scheduled time must be in the future');
    } else {
      alert('❌ Failed to schedule exam');
    }
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Available Exams</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => {
          const scheduledEntry = scheduled.find(s => s.examId === exam._id);
          const now = new Date();
          const scheduledTime = scheduledEntry ? new Date(scheduledEntry.scheduledAt) : null;
          const timeDiff = scheduledTime
          ? (new Date().getTime() - new Date(scheduledTime).getTime()) / 60000
          : null;

          const isReady = timeDiff >= 0 && timeDiff <= 30;
          const isExpired = timeDiff > 30;

          return (
            <div key={exam._id} className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition">
              <h2 className="text-xl font-semibold text-indigo-600 mb-2">{exam.name}</h2>
              <p className="text-sm text-gray-500 mb-4">Type: {exam.type}, Difficulty: {exam.difficulty}</p>

              {/* Scheduling Inputs */}
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="date"
                  className="border p-2 rounded"
                  value={scheduledExams[exam._id]?.date || ''}
                  onChange={e =>
                    setScheduledExams(prev => ({
                      ...prev,
                      [exam._id]: {
                        ...prev[exam._id],
                        date: e.target.value
                      }
                    }))
                  }
                />
                <input
                  type="time"
                  className="border p-2 rounded"
                  value={scheduledExams[exam._id]?.time || ''}
                  onChange={e =>
                    setScheduledExams(prev => ({
                      ...prev,
                      [exam._id]: {
                        ...prev[exam._id],
                        time: e.target.value
                      }
                    }))
                  }
                />
                <input
  type="number"
  min="1"
  placeholder="Duration (minutes)"
  className="border p-2 rounded"
  value={scheduledExams[exam._id]?.duration || ''}
  onChange={e =>
    setScheduledExams(prev => ({
      ...prev,
      [exam._id]: {
        ...prev[exam._id],
        duration: e.target.value
      }
    }))
  }
/>

                {/* Schedule Button or Status */}
                {scheduledEntry ? (
                  isExpired ? (
                    <p className="text-red-600 font-semibold">⛔ Exam Ended</p>
                  ) : (
                    <button
                      disabled={true}
                      className="bg-gray-300 text-gray-500 px-4 py-2 rounded cursor-not-allowed"
                    >
                      Scheduled for: {new Date(scheduledEntry.scheduledAt).toLocaleString()}
                    </button>
                  )
                ) : (
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                    onClick={() => handleSchedule(exam._id)}
                  >
                    Schedule
                  </button>
                )}
              </div>

              {/* Attempt Button */}
              {scheduledEntry && !isExpired ? (
                <button
                  disabled={!isReady}
                  onClick={() => navigate(`/attempt/${exam._id}`)}
                  className={`py-2 px-4 rounded w-full font-medium ${
                    isReady
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isReady ? 'Attempt Exam' : 'Waiting for Scheduled Time'}
                </button>
              ) : (
                <p className="text-sm text-gray-500 text-center">Schedule to unlock attempt</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Examviewer;
