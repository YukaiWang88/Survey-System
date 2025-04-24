const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Response = require('../models/Response');
// const { ObjectId } = require('mongodb');

// p
router.post('/', async (req, res) => {
    try {
        const { surveyId,       // Assuming surveyId is already defined
            answers,        // Your list of answers
            participantId } = req.body;
      
        // Process and respond

        console.log("save reponse");

        const response = new Response({
            survey: surveyId,
            user: participantId,
            completed: true,
            completedAt: new Date(),
            answers
        });

        await response.save();
        // console.log(`Successfully inserted ${insertResult.insertedCount} responses`);
        res.json({ message: 'Survey submitted successfully' });
    } catch (err) {
        console.error('Save error: ', err);
        res.status(400).json({ 
          message: 'Error saving answers', 
          error: err.message 
        });
      }




});



module.exports = router;