import { useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const currentEmail = localStorage.getItem('email');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [email, setEmail] = useState(currentEmail || '');
  const [gender, setGender] = useState(localStorage.getItem('gender') || '');
  const [password, setPassword] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put('http://localhost:3000/update-profile', {
        currentEmail,
        username,
        email,
        gender,
        password
      });

      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      localStorage.setItem('gender', gender);

      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Update error:', err);
      alert('Failed to update profile');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form onSubmit={handleUpdate} className="bg-white p-8 rounded shadow-lg w-[500px]">
        <h2 className="text-2xl font-bold text-center mb-6">Edit Profile</h2>

        <label className="block font-bold mb-1">Username</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block font-bold mb-1">Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

        <label className="block font-bold mb-1">Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        >
          <option value="">Select Gender</option>
          <option value="male">Male </option>
          <option value="female">Female </option>
          <option value="other">Other </option>
        </select>

        <label className="block font-bold mb-1">New Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 p-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
