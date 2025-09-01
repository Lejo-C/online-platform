import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AttemptExam = () => {
  const { id: examId } = useParams();
  const username = localStorage.getItem('username');
  const [approvalStatus, setApprovalStatus] = useState('idle'); // idle | waiting | error

  const handleRequestAccess = () => {
    axios.post('http://localhost:3000/exams/request-approval', {
      examId,
      username
    })
      .then(() => {
        setApprovalStatus('waiting');
      })
      .catch(err => {
        console.error('Approval request failed:', err);
        setApprovalStatus('error');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 flex flex-col items-center justify-center p-6">
      {approvalStatus === 'idle' && (
        <button
          onClick={handleRequestAccess}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition"
        >
          Attempt Exam
        </button>
      )}

      {approvalStatus === 'waiting' && (
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <h2 className="text-2xl font-bold text-indigo-600 mb-4">⏳ Waiting for Admin Approval</h2>
          <p className="text-gray-700 text-sm">
            Your request to attempt the exam has been sent. Please wait while the admin reviews it.
          </p>
        </div>
      )}

      {approvalStatus === 'error' && (
        <div className="mt-8 bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">❌ Error</h2>
          <p className="text-gray-700 text-sm">
            Something went wrong while sending your approval request. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default AttemptExam;
