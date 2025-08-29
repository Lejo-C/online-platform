import axios from 'axios';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/signup/signin', { email, password });

      const { message, role, username, email: emaildb, gender } = response.data;

      console.log('Login response:', response.data);

      

      if (message === 'Login successful') {
        localStorage.setItem('username', username); 
        localStorage.setItem('role', role); 
        localStorage.setItem('email', emaildb);      
        localStorage.setItem('gender', gender); 
        console.log('Saved username to localStorage:', username);


        if (email.toLowerCase().includes('admin')) {
          navigate('/admin');
        } else {
          navigate('/student');
        }
      } else {
        alert(message);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-200 to-purple-100 flex items-center justify-center">
      <div className="bg-white w-[650px] h-[400px] rounded-3xl p-6 shadow-lg relative">
        <h1 className="text-center font-bold text-2xl">Sign In</h1>
        <Link to="/signup" className="absolute top-4 right-6 px-2 text-white py-2 border rounded-lg border-black font-bold hover:bg-green-600 bg-green-500">
          Sign Up
        </Link>
        <form onSubmit={handleSubmit} className="mt-10 ml-20">
          <h3 className="font-bold">Email</h3>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-3 rounded-lg border w-[400px] pl-4 py-2"
            placeholder="Email"
            required
          />

          <h3 className="mt-3 font-bold">Password</h3>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-3 rounded-lg border w-[400px] pl-4 py-2"
            placeholder="Password"
            required
          />

          <button
            type="submit"
            className="mt-5 ml-5 px-4 py-2 bg-green-500 border rounded-lg border-black font-bold text-white hover:bg-green-600"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
