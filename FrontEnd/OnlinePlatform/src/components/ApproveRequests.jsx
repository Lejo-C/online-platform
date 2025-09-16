import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ApproveRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
  axios.get('http://localhost:3000/exams/approval-requests')
    .then(res => {
      const pendingOnly = res.data.filter(r => r.status === 'pending');
      setRequests(pendingOnly);
    })
    .catch(err => console.error('Error fetching requests:', err));
}, []);


  const handleAction = async (id, status) => {
    try {
      await axios.post('http://localhost:3000/exams/approve', { id, status });
      setRequests(prev => prev.filter(r => r._id !== id));
    } catch (err) {
      console.error('Error updating request:', err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Exam Approval Requests</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No pending requests.</p>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
              <div>
                <p><strong>Student:</strong> {req.username}</p>
                <p><strong>Exam:</strong> {req.examId?.name || 'Unknown'}</p>
                <p><strong>Requested At:</strong> {new Date(req.requestedAt).toLocaleString()}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleAction(req._id, 'approved')}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(req._id, 'rejected')}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveRequests;
