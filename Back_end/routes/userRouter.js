const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  res.status(201).json({ message: 'Signup successful' });
});

module.exports = router;
