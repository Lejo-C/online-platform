import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser, faTrash, faUserGraduate, faClipboardList, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const username = localStorage.getItem('username') || 'Admin';

const AdminDashboard = () => {
  const navigate = useNavigate(); // <-- Move useNavigate here

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

  useEffect(() => {
    if (showList) {
      axios.get('http://localhost:3000/users/students')
        .then(res => {
          const data = Array.isArray(res.data) ? res.data : [];
          setStudents(data);
        })
        .catch(err => {
          console.error('Error fetching students:', err);
          setStudents([]);
        });
    }
  }, [showList]);

  const handleToggleStudents = () => {
    setShowList(prev => !prev);
    setShowExams(false); // hide exams when students are toggled
  };

  const handleToggleExams = () => {
    setShowExams(prev => !prev);
    setShowList(false); // hide students when exams are toggled
  };

  const handleDelete = async (examId) => {
    if (!examId) return;

    try {
      await axios.delete(`http://localhost:3000/exams/${examId}`);
      setExams(prev => prev.filter(exam => exam._id !== examId));
    } catch (error) {
      console.error('Delete failed:', error.response?.data || error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-indigo-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-indigo-700">Admin Panel</h2>
        <nav className="space-y-4 text-gray-700">
          <div
            className="flex items-center gap-3 hover:text-indigo-600 cursor-pointer"
            onClick={handleToggleStudents}
          >
            <FontAwesomeIcon icon={faUserGraduate} />
            <span>{showList ? 'Hide Students' : 'View Students'}</span>
          </div>
          <div
            className="flex items-center gap-3 hover:text-indigo-600 cursor-pointer"
            onClick={handleToggleExams}
          >
            <FontAwesomeIcon icon={faClipboardList} />
            <span>{showExams ? 'Hide Exams' : 'View Exams'}</span>
          </div>
          <div
            onClick={() => navigate('/create-exam')}
            className="flex items-center gap-3 hover:text-indigo-600 cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlusCircle} />
            <span>Create Exam</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        {/* Profile Icon */}
        <div className="flex justify-end mb-6">
          <Link
            to="/profile"
            className="text-indigo-700 hover:text-indigo-900 transition duration-200"
            title="View Profile"
          >
            <FontAwesomeIcon icon={faCircleUser} size="2x" />
          </Link>
        </div>

        {/* Welcome Box */}
        <div className="bg-white/30 backdrop-blur-md p-8 rounded-3xl shadow-xl text-center max-w-xl mx-auto border border-white/40 mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow">
            Welcome, {username} 🛡️
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Manage cadets, exams, and training resources with clarity and control.
          </p>
        </div>

        {/* Student List */}
        {showList && (
          <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Registered Students</h2>
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
          <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Created Exams</h2>
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
      </main>
    </div>
  );
};

export default AdminDashboard;
