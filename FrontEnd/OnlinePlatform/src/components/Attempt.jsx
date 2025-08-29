import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Attempt = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/exams`)
      .then(res => {
        const target = res.data.find(e => e._id === id);
        setExam(target);
        setAnswers(new Array(target.questions.length).fill(''));
      });
  }, [id]);

  const handleSubmit = async () => {
    const res = await axios.post(`http://localhost:3000/exams/submit/${id}`, { answers });
    setResult(res.data);
  };

  if (!exam) return <p>Loading exam...</p>;

  return (
    <div>
      <h2>{exam.name}</h2>
      {exam.questions.map((q, i) => (
        <div key={i}>
          <p>{q.text}</p>
          {q.type === 'mcq' && q.options.map((opt, idx) => (
            <label key={idx}>
              <input type="radio" value={opt} name={`q${i}`} onChange={() => {
                const copy = [...answers];
                copy[i] = opt;
                setAnswers(copy);
              }} />
              {opt}
            </label>
          ))}
          {q.type === 'truefalse' && (
            <>
              <label><input type="radio" value="true" name={`q${i}`} onChange={() => {
                const copy = [...answers];
                copy[i] = true;
                setAnswers(copy);
              }} />True</label>
              <label><input type="radio" value="false" name={`q${i}`} onChange={() => {
                const copy = [...answers];
                copy[i] = false;
                setAnswers(copy);
              }} />False</label>
            </>
          )}
          {q.type === 'fillblank' && (
            <input type="text" onChange={e => {
              const copy = [...answers];
              copy[i] = e.target.value;
              setAnswers(copy);
            }} />
          )}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit Exam</button>

      {result && (
        <div>
          <p>Score: {result.score}/{result.total}</p>
          {result.feedback.map((f, i) => (
            <div key={i}>
              <p>❌ <strong>{f.question}</strong></p>
              <p>Your answer: {f.yourAnswer}</p>
              <p>Correct answer: {f.correctAnswer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Attempt;
