const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const studentRoute = require('./routes/student');
const signupRoute = require('./routes/signup');
const examRoute = require('./routes/examRouter');

const app = express();

// ✅ Global Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// ✅ Serve React Frontend (Vite build)
const frontendPath = path.join(__dirname, '../FrontEnd/OnlinePlatform/dist');
app.use(express.static(frontendPath));

// ✅ Route Mounting — must come BEFORE catch-all
app.use('/signup', signupRoute);
app.use('/exams', examRoute);
app.use('/users', studentRoute);

// ✅ MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/online_platform')
  .then(() => console.log('🟢 MongoDB connected'))
  .catch(err => console.error('🔴 DB error:', err));

// ✅ Catch-All Route — must come LAST
app.use((req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ✅ Server Start
app.listen(3000, () => console.log('🚀 Server running on port 3000'));
