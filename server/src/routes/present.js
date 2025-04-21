const express = require('express');
const router = express.Router();
const Survey = require('../models/Survey');

// Join present by code
router.post('/', async (req, res) => {
  try {
    const { code, nickname } = req.body;
    
    console.log(`Join attempt: code=${code}, nickname=${nickname}`);
    
    if (!code || !nickname) {
      return res.status(400).json({ message: 'Survey code and nickname are required' });
    }

    // Find the survey by code (case insensitive)
    const survey = await Survey.findOne({ code: code });
    
    if (!survey) {
      console.log(`Survey not found with code: ${code}`);
      return res.status(404).json({ message: 'Survey not found' });
    }

    if (!survey.isActive) {
      console.log(`Survey ${code} is not alive`);
      return res.status(404).json({ message: 'Survey not accepting answers now' });
    }
    
    // randomly create a user id
    const participantId = `participant-${Date.now()}`;
    
    let surveyId = survey._id;

    res.json({
      surveyId,
      code,
      title: survey.title,
      participantId,
      nickname
    });
    
  } catch (err) {
    console.error('Join survey error:', err);
    res.status(500).json({ message: 'Server error while joining survey' });
  }
});


module.exports = router;