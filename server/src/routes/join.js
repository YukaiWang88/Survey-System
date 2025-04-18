const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');

// Join a survey by code
router.post('/', async (req, res) => {
  try {
    const { code, nickname } = req.body;
    
    console.log(`Join attempt: code=${code}, nickname=${nickname}`);
    
    if (!code || !nickname) {
      return res.status(400).json({ message: 'Survey code and nickname are required' });
    }

    // Find the survey by code (case insensitive)
    const survey = await Survey.findOne({ 
      code: new RegExp(`^${code}$`, 'i')
    });
    
    if (!survey) {
      console.log(`Survey not found with code: ${code}`);
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    // Make the survey active if it's not already
    if (!survey.isActive) {
      survey.isActive = true;
      await survey.save();
      console.log(`Activated survey: ${survey.title} (${code})`);
    }
    
    // Generate participant token
    const participantId = Date.now().toString();
    
    // Return success response
    res.json({
      surveyId: survey._id,
      code: survey.code,
      title: survey.title,
      participantId,
      nickname
    });
    
  } catch (err) {
    console.error('Join survey error:', err);
    res.status(500).json({ message: 'Server error while joining survey' });
  }
});

// Verify a survey exists before joining
router.get('/verify/:code', async (req, res) => {
  try {
    const { code } = req.params;
    
    // Find survey by code (case insensitive)
    const survey = await Survey.findOne({ 
      code: new RegExp(`^${code}$`, 'i')
    });
    
    if (!survey) {
      return res.status(404).json({ exists: false });
    }
    
    res.json({ 
      exists: true, 
      title: survey.title,
      isActive: survey.isActive 
    });
    
  } catch (err) {
    console.error('Verify survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;