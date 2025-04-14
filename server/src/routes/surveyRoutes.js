// filepath: ./server/src/routes/surveyRoutes.js
const express = require('express');
const router = express.Router();

// Temporary simple routes (no database connection yet)
router.post('/', (req, res) => {
  res.status(201).json({ 
    message: 'Survey created successfully', 
    survey: {
      ...req.body,
      id: Date.now().toString(),
      code: Math.random().toString(36).substring(2, 8).toUpperCase()
    } 
  });
});

router.get('/', (req, res) => {
  res.status(200).json([
    { id: '1', title: 'Sample Survey 1', questions: [] },
    { id: '2', title: 'Sample Survey 2', questions: [] }
  ]);
});

router.get('/:code', (req, res) => {
  res.status(200).json({ 
    id: '1', 
    code: req.params.code, 
    title: 'Sample Survey', 
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
});

module.exports = router;