import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleUser,
  faClipboardList,
  faCalendarCheck,
  faQuestionCircle,
  faSignOutAlt
} from '@fortawesome/free-solid-svg-icons';

const username = localStorage.getItem('username') || 'Student';

const StudentDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-200 via-purple-300 to-pink-200 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-purple-700">Student</h2>
        <nav className="space-y-4 text-gray-700">
          <div
  onClick={() => window.location.href = '/exam-viewer'}
  className="flex items-center gap-3 hover:text-purple-600 cursor-pointer"
>
  <FontAwesomeIcon icon={faClipboardList} />
  <span>View Exams</span>
</div>


          <div className="flex items-center gap-3 hover:text-purple-600 cursor-pointer">
            <FontAwesomeIcon icon={faCalendarCheck} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center gap-3 hover:text-purple-600 cursor-pointer">
            <FontAwesomeIcon icon={faQuestionCircle} />
            <span>Doubts & Q&A</span>
          </div>
          <div className="flex items-center gap-3 text-red-500 hover:text-red-700 cursor-pointer">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 relative">
        {/* Profile Icon */}
        <div className="flex justify-end mb-6">
          <Link
            to="/profile"
            className="text-white hover:text-yellow-300 transition duration-200"
            title="View Profile"
          >
            <FontAwesomeIcon icon={faCircleUser} size="2x" />
          </Link>
        </div>

        {/* Welcome Card */}
        <div className="bg-white/30 backdrop-blur-md p-10 rounded-3xl shadow-xl text-center max-w-lg mx-auto border border-white/40">
          <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow">
            Welcome, {username} 🎓
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Your personal dashboard to explore exams, results, and more.
          </p>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
