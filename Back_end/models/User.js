const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'student'], default: 'student' },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  imageURL: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema);
