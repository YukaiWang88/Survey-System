const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock auth middleware
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

// Get all surveys (mocked)
router.get('/', async (req, res) => {
  if (global.mockDB) {
    const userSurveys = global.mockDB.surveys.filter(s => s.creator === req.user._id);
    return res.json(userSurveys);
  }
  
  // Fallback mock data if mockDB not initialized
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
});

module.exports = router;