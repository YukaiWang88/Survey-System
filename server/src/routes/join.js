const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');

// Test route to verify router works
router.get('/', (req, res) => {
  res.json({ message: 'Join router working!' });
});

// Main join route
router.post('/', async (req, res) => {
  try {
    const { code, nickname } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Survey code is required' });
    }
    
    // randomly create a user id
    const participantId = `participant-${Date.now()}`;
    let survey = await Survey.findOne({ code: code });
    if (!survey) {
      return res.status(400).json({ message: "Survey Not Found" });
    }
    
    let surveyId = survey._id;

    res.json({
      surveyId,
      participantId,
      nickname,
      message: 'Successfully joined survey',
    });
  } catch (err) {
    console.error('Join error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;