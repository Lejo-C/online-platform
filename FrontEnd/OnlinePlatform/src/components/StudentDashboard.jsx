import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';

const username = localStorage.getItem('username');

const StudentDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-200 to-purple-100 relative">
      <Link
        to="/profile"
        className="absolute top-6 right-6 text-black hover:text-blue-600 transition duration-200"
        title="View Profile"
      >
        <FontAwesomeIcon icon={faCircleUser} size="2x" />
      </Link>

      <div className="w-full flex justify-center pt-16">
        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md w-full mx-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, {username || 'Student'} 🙌</h1>
          <p className="mt-3 text-gray-600 text-base">
            This is your personal dashboard. Explore your assignments, results, and more.
          </p>
          <hr className="my-4 border-gray-200" />
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Link to="/exam-viewer">
          <button type="button" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            View Exams
          </button>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
