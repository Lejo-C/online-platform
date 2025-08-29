router.get('/exams', async (req, res) => {
  try {
    const exams = await Exam.find()
      .sort({ createdAt: -1 })
      .populate('questions');

    res.status(200).json(exams);
  } catch (err) {
    console.error('Exam fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
