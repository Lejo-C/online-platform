const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const studentRoute = require('./routes/student');
// ✅ Route Imports
const signupRoute = require('./routes/signup');
const examRoute = require('./routes/exam'); // 👈 Make sure this file exists

const app = express();

// ✅ Global Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ✅ Route Mounting
app.use('/signup', signupRoute); 
app.use('/exams', examRoute);   
app.use('/users', studentRoute); 
// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/online_platform')
  .then(() => console.log('🟢 MongoDB connected'))
  .catch(err => console.error('🔴 DB error:', err));

// ✅ Server Start
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
