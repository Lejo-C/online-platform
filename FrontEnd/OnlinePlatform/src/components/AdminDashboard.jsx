import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faTrash } from '@fortawesome/free-solid-svg-icons';

const username = localStorage.getItem('username');

const AdminDashboard = () => {
  const [exams, setExams] = useState([]);
  const [showExams, setShowExams] = useState(false);
  const [students, setStudents] = useState([]);
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    if (showExams) {
      axios.get('http://localhost:3000/exams')
        .then(res => setExams(res.data))
        .catch(err => {
          console.error('Error fetching exams:', err);
          alert('Failed to load exams. Please check your backend.');
        });
    }
  }, [showExams]);

  const handleViewStudents = async () => {
    if (showList) {
      setShowList(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:3000/users/students'); // ✅ updated endpoint
      const data = Array.isArray(response.data) ? response.data : [];
      setStudents(data);
      setShowList(true);
      console.log('Fetched students:', data);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const handleDelete = async (examId) => {
    if (!examId) {
      console.error('Delete failed: examId is not defined');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:3000/exams/${examId}`);
      console.log('Delete response:', response.data);
      setExams(prev => prev.filter(exam => exam._id !== examId));
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-200 to-purple-100 relative">
      {/* Profile Icon */}
      <Link
        to="/profile"
        className="absolute top-6 right-6 text-black hover:text-blue-600 transition duration-200"
        title="View Profile"
      >
        <FontAwesomeIcon icon={faCircleUser} size="2x" />
      </Link>

      {/* Welcome Box */}
      <div className="w-full flex justify-center pt-16">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {username || 'Admin'} 🙌</h1>
          <p className="mt-3 text-gray-600 text-base">
            This is your admin dashboard. Manage users, content, and analytics here.
          </p>
          <hr className="my-4 border-gray-300" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-12 flex flex-row justify-center gap-6">
        <button
          onClick={handleViewStudents}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {showList ? 'Hide Students' : 'View Students'}
        </button>

        <Link to="/create-exam">
          <button
            type="button"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Create Exams
          </button>
        </Link>

        <button
          onClick={() => setShowExams(!showExams)}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
        >
          {showExams ? 'Hide Exams' : 'Show Created Exams'}
        </button>
      </div>

      {/* Student List */}
      {showList && (
        <div className="mt-10 max-w-4xl mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Registered Students</h2>
          {students.length === 0 ? (
            <p className="text-gray-500">No students found.</p>
          ) : (
            <ul className="space-y-4">
              {students.map(student => (
                <li key={student._id} className="border-b pb-4">
                  <p className="font-semibold text-lg">{student.username}</p>
                  <p className="text-sm text-gray-600">Email: {student.email}</p>
                  <p className="text-sm text-gray-600">Gender: {student.gender}</p>
                  <p className="text-sm text-gray-600">Role: {student.role}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Exam List */}
      {showExams && (
        <div className="w-full max-w-4xl mt-6 mx-auto bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">Created Exams</h2>
          {exams.length === 0 ? (
            <p className="text-gray-500">No exams found.</p>
          ) : (
            exams.map(exam => (
              <div key={exam._id} className="flex justify-between items-center border-b py-3">
                <div>
                  <p className="font-semibold">{exam.name}</p>
                  <p className="text-sm text-gray-600">Type: {exam.type} | Difficulty: {exam.difficulty}</p>
                </div>
                <button
                  onClick={() => handleDelete(exam._id)}
                  className="text-red-600 hover:text-red-800"
                  title="Delete Exam"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
