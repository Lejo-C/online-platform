import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import Examviewer from './components/Examviewer';
import CreateExam from './components/CreateExam'; 
import React from 'react';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/student" element={<StudentDashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/edit-profile" element={<EditProfile />} />
      <Route path="/exam-viewer" element={<Examviewer />} />
      <Route path="/create-exam" element={<CreateExam />} />
    </Routes>
  );
}

export default App;
