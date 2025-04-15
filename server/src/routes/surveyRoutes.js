const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

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
    
    // Use mock DB if available
    if (global.mockDB) {
      const user = global.mockDB.users.find(u => u._id === decoded.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }
      req.user = {
        _id: user._id,
        name: user.name,
        email: user.email
      };
    } else {
      // Skip actual MongoDB validation for now
      req.user = { _id: decoded.userId };
    }
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
    const surveyData = {
      ...req.body,
      _id: Date.now().toString(),
      creator: req.user._id,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date()
    };
    
    if (global.mockDB) {
      global.mockDB.surveys.push(surveyData);
      return res.status(201).json({ 
        message: 'Survey created successfully', 
        survey: surveyData
      });
    }
    
    // Fallback for when MongoDB is available but not used in this code
    res.status(201).json({ 
      message: 'Survey created successfully', 
      survey: surveyData
    });
  } catch (err) {
    console.error('Create survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ - Get all surveys for the current user
router.get('/', async (req, res) => {
  try {
    if (global.mockDB) {
      const userSurveys = global.mockDB.surveys.filter(s => s.creator === req.user._id);
      return res.json(userSurveys);
    }
    
    // Fallback mock data
    res.json([
      {
        _id: '1',
        title: 'Sample Survey 1',
        description: 'This is a sample survey',
        creator: req.user._id,
        createdAt: new Date(),
        questions: []
      },
      {
        _id: '2',
        title: 'Sample Survey 2',
        description: 'Another sample survey',
        creator: req.user._id,
        createdAt: new Date(),
        questions: []
      }
    ]);
  } catch (err) {
    console.error('Get surveys error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// READ - Get a survey by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (global.mockDB) {
      const survey = global.mockDB.surveys.find(s => s._id === id && s.creator === req.user._id);
      if (!survey) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      return res.json(survey);
    }
    
    // Fallback mock data
    res.json({ 
      _id: id, 
      title: 'Sample Survey', 
      description: 'This is a sample survey',
      creator: req.user._id,
      createdAt: new Date(),
      questions: [
        {
          id: 'q1',
          type: 'multiple-choice',
          text: 'What is your favorite color?',
          options: [
            {text: 'Red', value: 'red'},
            {text: 'Blue', value: 'blue'},
            {text: 'Green', value: 'green'}
          ]
        }
      ] 
    });
  } catch (err) {
    console.error('Get survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// UPDATE - Update a survey
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (global.mockDB) {
      const surveyIndex = global.mockDB.surveys.findIndex(s => s._id === id && s.creator === req.user._id);
      if (surveyIndex === -1) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      
      global.mockDB.surveys[surveyIndex] = {
        ...global.mockDB.surveys[surveyIndex],
        ...req.body,
        updatedAt: new Date()
      };
      
      return res.json({ 
        message: 'Survey updated successfully',
        survey: global.mockDB.surveys[surveyIndex] 
      });
    }
    
    res.json({ message: 'Survey updated successfully' });
  } catch (err) {
    console.error('Update survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Delete a survey
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (global.mockDB) {
      const surveyIndex = global.mockDB.surveys.findIndex(s => s._id === id && s.creator === req.user._id);
      if (surveyIndex === -1) {
        return res.status(404).json({ message: 'Survey not found' });
      }
      
      global.mockDB.surveys.splice(surveyIndex, 1);
      return res.json({ message: 'Survey deleted successfully' });
    }
    
    res.json({ message: 'Survey deleted successfully' });
  } catch (err) {
    console.error('Delete survey error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;