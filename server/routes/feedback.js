const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit Feedback (POST /api/feedback)
router.post('/', async (req, res) => {
  const { rating, comment } = req.body;
  try {
    const feedback = new Feedback({
      userId: req.user.id, // From JWT payload
      rating,
      comment,
    });
    await feedback.save();
    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback', error });
  }
});

// Get All Feedback (GET /api/feedback) - For Admin
router.get('/', async (req, res) => {
  // Add role check for admin if needed
  try {
    const feedback = await Feedback.find().populate('userId', 'name email');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching feedback', error });
  }
});

module.exports = router;