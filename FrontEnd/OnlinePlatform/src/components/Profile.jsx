import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Profile = () => {
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  const email = localStorage.getItem('email');
  const gender = localStorage.getItem('gender');
  const [image, setImage] = useState(localStorage.getItem('imageURL') || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !email) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        const response = await axios.put('http://localhost:3000/upload-profile-image', {
          email,
          image: base64
        });

        localStorage.setItem('imageURL', base64);
        setImage(base64);
      } catch (err) {
        console.error('Upload error:', err);
        alert('Upload failed');
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 via-blue-200 to-purple-100 flex flex-col items-center">
      <div className="w-full bg-white p-6 shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">Profile 👤</h1>
      </div>

      <div className="relative mt-8 mb-6">
        <label htmlFor="imageUpload" className="cursor-pointer">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-lg hover:shadow-xl transition duration-300">
            {image ? (
              <img src={image} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-600 font-medium">
                Upload
              </div>
            )}
          </div>
        </label>
        <input
          type="file"
          id="imageUpload"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] text-center flex flex-col items-center">
        <h2 className="text-xl font-semibold text-gray-700">Username: {username || 'Guest'}</h2>
        <h3 className="text-lg font-medium text-gray-600 mt-2">Role: {role || 'Unknown'}</h3>
        <h3 className="text-lg font-medium text-gray-600 mt-2">Email: {email || 'N/A'}</h3>
        <h3 className="text-lg font-medium text-gray-600 mt-2">Gender: {gender || 'N/A'}</h3>
        <p className="text-gray-500 mt-4">You can update your profile by clicking on the button below.</p>
        <Link to="/edit-profile" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">
          Edit Profile</Link>
      </div>
    </div>
  );
};

export default Profile;
