const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Survey = require('../models/Survey'); // Import the Survey model

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    if (!req.header('Authorization')) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || '665eced222ba5d45aa7e3774cc8d30bb4fc122be7ef6c9e6ec31996bdd78e184a00460c1ab1436c615016dcfc4ece66d3f581fc41c7380adf154a850149ab7c7'
    );
    
    // For now, just pass the user ID
    req.user = { _id: decoded.userId };
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Use auth middleware for all routes
router.use(auth);

// CREATE - Create a new survey
router.post('/', async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    // Create a new survey using the MongoDB model
    const newSurvey = new Survey({
      title,
      description,
      questions,
      creator: req.user._id,
      code: Math.random().toString(36).substring(2, 8).toUpperCase()
    });
    
    // Save to MongoDB
    await newSurvey.save();
    
    res.status(201).json({ 
      message: 'Survey created successfully', 
      survey: newSurvey
    });
  } catch (err) {
    console.error('Create survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ - Get all surveys for the current user
router.get('/', async (req, res) => {
  console.log('GET /api/surveys request received');
  console.log('Auth header:', req.header('Authorization'));
  console.log('User ID:', req.user?._id);
  try {
    // Get surveys from MongoDB
    const surveys = await Survey.find({ creator: req.user._id });
    res.json(surveys);
  } catch (err) {
    console.error('Get surveys error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ - Get a survey by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find survey in MongoDB
    const survey = await Survey.findOne({ 
      _id: id, 
      creator: req.user._id 
    });
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    res.json(survey);
  } catch (err) {
    console.error('Get survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get surveys the user has participated in
router.get('/joined', auth, async (req, res) => {
  try {
    // Assuming you have a Response model that tracks survey participation
    const participations = await Response.find({ 
      user: req.user._id 
    }).populate('survey');
    
    res.json(participations);
  } catch (err) {
    console.error('Error fetching joined surveys:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// UPDATE - Update a survey
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and update survey in MongoDB
    const updatedSurvey = await Survey.findOneAndUpdate(
      { _id: id, creator: req.user._id },
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!updatedSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    res.json({ 
      message: 'Survey updated successfully',
      survey: updatedSurvey 
    });
  } catch (err) {
    console.error('Update survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete a survey
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete survey in MongoDB
    const deletedSurvey = await Survey.findOneAndDelete({ 
      _id: id, 
      creator: req.user._id 
    });
    
    if (!deletedSurvey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    res.json({ message: 'Survey deleted successfully' });
  } catch (err) {
    console.error('Delete survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all responses for a survey
router.get('/:id/responses', auth, async (req, res) => {
  try {
    // Find the survey first to check ownership
    const survey = await Survey.findOne({ 
      _id: req.params.id,
      creator: req.user._id
    });
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    // Get all responses
    const responses = await Response.find({ 
      survey: req.params.id 
    }).sort({ createdAt: -1 });
    
    res.json(responses);
  } catch (err) {
    console.error('Error fetching survey responses:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get aggregated statistics for a survey
router.get('/:id/stats', auth, async (req, res) => {
  try {
    // Find the survey
    const survey = await Survey.findOne({
      _id: req.params.id,
      creator: req.user._id
    });
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    // Get responses
    const responses = await Response.find({ survey: req.params.id });
    
    // Calculate basic stats
    const completedResponses = responses.filter(r => r.completed);
    
    // Calculate completion rate
    const completionRate = responses.length > 0 
      ? Math.round((completedResponses.length / responses.length) * 100) 
      : 0;
    
    // Calculate average time (for completed responses only)
    const completionTimes = completedResponses
      .filter(r => r.startedAt && r.completedAt)
      .map(r => new Date(r.completedAt) - new Date(r.startedAt));
    
    const averageTime = completionTimes.length > 0
      ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
      : 0;
    
    const minutes = Math.floor(averageTime / 60000);
    const seconds = Math.floor((averageTime % 60000) / 1000);
    const formattedAvgTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Get daily response counts for the past week
    const now = new Date();
    const pastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const dailyResponses = await Response.aggregate([
      { 
        $match: { 
          survey: new mongoose.Types.ObjectId(req.params.id),
          createdAt: { $gte: pastWeek } 
        } 
      },
      {
        $group: {
          _id: { 
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } 
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    // Format for charting
    const formattedDailyResponses = dailyResponses.map(item => ({
      date: item._id,
      count: item.count
    }));
    
    // Device breakdown
    const deviceCounts = {};
    responses.forEach(response => {
      const device = response.deviceInfo?.deviceType || 'Unknown';
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    
    const deviceBreakdown = Object.keys(deviceCounts).map(device => ({
      name: device,
      value: deviceCounts[device]
    }));
    
    // Analyze individual questions
    const questionStats = await Promise.all(survey.questions.map(async (question) => {
      // This would be expanded in a real implementation with specific analysis for each question type
      return {
        id: question._id,
        text: question.text || question.questionText,
        type: question.type,
        // Simplified analysis - would be more comprehensive in real implementation
        responseCount: responses.filter(r => 
          r.answers && r.answers.some(a => a.questionId === question._id.toString())
        ).length
      };
    }));
    
    res.json({
      surveyId: survey._id,
      totalResponses: responses.length,
      completedResponses: completedResponses.length,
      completionRate,
      averageTime: formattedAvgTime,
      dailyResponses: formattedDailyResponses,
      deviceBreakdown,
      questionStats
    });
  } catch (err) {
    console.error('Error fetching survey statistics:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Close a survey
router.patch('/:id/close', auth, async (req, res) => {
  try {
    const survey = await Survey.findOneAndUpdate(
      { _id: req.params.id, creator: req.user._id },
      { isActive: false },
      { new: true }
    );
    
    if (!survey) {
      return res.status(404).json({ message: 'Survey not found' });
    }
    
    res.json({ message: 'Survey closed successfully', survey });
  } catch (err) {
    console.error('Error closing survey:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;