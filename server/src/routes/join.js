const express = require('express');
const router = express.Router();

// Test route to verify router works
router.get('/', (req, res) => {
  res.json({ message: 'Join router working!' });
});

// Main join route
router.post('/', (req, res) => {
  try {
    const { code, nickname } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Survey code is required' });
    }
    
    console.log('Join request received:', { code, nickname });
    
    // Mock data for testing
    const surveyId = `survey-${Date.now()}`;
    const participantId = `participant-${Date.now()}`;
    
    res.json({
      surveyId,
      participantId,
      message: 'Successfully joined survey'
    });
  } catch (err) {
    console.error('Join error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;