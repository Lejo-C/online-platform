import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Attempt = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/exams`)
      .then(res => {
        const target = res.data.find(e => e._id === id);
        if (!target) {
          setError('Exam not found');
          return;
        }
        setExam(target);
        setAnswers(new Array(target.questions?.length || 0).fill(''));
      })
      .catch(err => {
        console.error('Error fetching exam:', err);
        setError('Failed to load exam');
      });
  }, [id]);

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`http://localhost:3000/exams/submit/${id}`, { answers });
      setResult(res.data);
    } catch (err) {
      console.error('Error submitting exam:', err);
      setError('Failed to submit exam');
    }
  };

  if (error) return <p className="text-red-600 text-center mt-10">{error}</p>;
  if (!exam) return <p className="text-gray-500 text-center mt-10">Loading exam...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">{exam.name}</h2>

      {exam.questions.map((q, i) => (
        <div key={i} className="mb-6 bg-white p-4 rounded-xl shadow">
          <p className="font-semibold text-gray-800 mb-2">Q{i + 1}: {q.text}</p>

          {q.type === 'mcq' && q.options.map((opt, idx) => (
            <label key={idx} className="block mb-1">
              <input
                type="radio"
                value={opt}
                name={`q${i}`}
                onChange={() => {
                  const copy = [...answers];
                  copy[i] = opt;
                  setAnswers(copy);
                }}
                className="mr-2"
              />
              {opt}
            </label>
          ))}

          {q.type === 'truefalse' && (
            <div className="space-x-4">
              <label>
                <input
                  type="radio"
                  value="true"
                  name={`q${i}`}
                  onChange={() => {
                    const copy = [...answers];
                    copy[i] = true;
                    setAnswers(copy);
                  }}
                  className="mr-2"
                />
                True
              </label>
              <label>
                <input
                  type="radio"
                  value="false"
                  name={`q${i}`}
                  onChange={() => {
                    const copy = [...answers];
                    copy[i] = false;
                    setAnswers(copy);
                  }}
                  className="mr-2"
                />
                False
              </label>
            </div>
          )}

          {q.type === 'fillblank' && (
            <input
              type="text"
              className="w-full p-2 border rounded mt-2"
              onChange={e => {
                const copy = [...answers];
                copy[i] = e.target.value;
                setAnswers(copy);
              }}
            />
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition font-semibold"
      >
        Submit Exam
      </button>

      {result && (
        <div className="mt-8 bg-green-50 p-4 rounded-xl shadow">
          <p className="text-lg font-bold text-green-700 mb-4">
            ✅ Score: {result.score}/{result.total}
          </p>
          {result.feedback.map((f, i) => (
            <div key={i} className="mb-3">
              <p className="font-semibold text-red-600">❌ {f.question}</p>
              <p className="text-sm text-gray-700">Your answer: {f.yourAnswer}</p>
              <p className="text-sm text-gray-700">Correct answer: {f.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attempt;
