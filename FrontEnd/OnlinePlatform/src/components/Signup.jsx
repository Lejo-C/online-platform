import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔑 Automatically assign role based on emai
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'student';

    try {
      const res = await axios.post('http://localhost:3000/signup', {
        username, email, password, role, gender
      });

      alert(res.data.message);
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-green-100 via-blue-200 to-purple-100">
      <div className="bg-white rounded-3xl p-6 w-[650px] shadow-lg">
        <h1 className="text-center font-bold text-2xl">Sign Up</h1>
        <form onSubmit={handleSubmit} className="mt-8">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4 w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full px-4 py-2 border rounded-lg"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full px-4 py-2 border rounded-lg"
          />
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className='mb-4 w-full px-4 py-2 border rounded-lg'
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-lg font-bold hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
        <Link to="/" className="block mt-4 text-center text-blue-600 font-bold">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;
