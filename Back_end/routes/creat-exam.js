const express = require('express');
const router = express.Router();

// POST: /create-exam
router.post('/', (req, res) => {
  const { name, type } = req.body;

  
  // You can save to DB here or log for now
  console.log('Received exam:', { name, type });

  res.status(200).json({
  message: 'Exam created successfully!',
  exam: { name, type }
  });

});

module.exports = router;
