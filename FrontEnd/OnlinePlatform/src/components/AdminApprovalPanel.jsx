import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCheck, FaUserTimes, FaClock, FaCalendarAlt } from 'react-icons/fa';

const AdminApprovalPanel = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = () => {
    axios.get('http://localhost:3000/exams/pending-approvals')
      .then(res => setRequests(res.data))
      .catch(err => console.error('Error fetching approvals:', err));
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = (examId, username, status) => {
    axios.post('http://localhost:3000/exams/update-approval', {
      examId,
      username,
      status
    }).then(() => {
      alert(`✅ Request ${status}`);
      fetchRequests();
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-indigo-700 mb-10 text-center drop-shadow">
          📝 Pending Exam Approvals
        </h1>

        {requests.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No pending requests at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {requests.map(req => (
              <div
                key={req._id}
                className="bg-white/30 backdrop-blur-md border border-white/40 shadow-xl rounded-2xl p-6 transition hover:scale-[1.02]"
              >
                <h3 className="text-xl font-bold text-indigo-800 mb-2 flex items-center gap-2">
                  <FaUserCheck className="text-indigo-500" />
                  {req.username}
                </h3>

                <p className="text-sm text-gray-700 mb-1">
                  <span className="font-semibold">Exam ID:</span> {req.examId}
                </p>

                <p className="text-sm text-gray-700 mb-1 flex items-center gap-2">
                  <FaCalendarAlt className="text-indigo-400" />
                  {new Date(req.scheduledAt).toLocaleDateString()} at {new Date(req.scheduledAt).toLocaleTimeString()}
                </p>

                <p className="text-sm text-gray-700 mb-4 flex items-center gap-2">
                  <FaClock className="text-indigo-400" />
                  Duration: <span className="font-semibold">{req.duration} minutes</span>
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleDecision(req.examId, req.username, 'approved')}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
                  >
                    ✅ Approve
                  </button>
                  <button
                    onClick={() => handleDecision(req.examId, req.username, 'declined')}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
                  >
                    ❌ Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalPanel;
