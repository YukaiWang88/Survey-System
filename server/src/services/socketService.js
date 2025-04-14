// filepath: ./server/src/services/socketService.js

/**
 * Socket.IO service for real-time survey functionality
 * Handles connections, room management, and real-time updates
 */

// Importing models - these would be created in models directory
// const Survey = require('../models/Survey');
// const Response = require('../models/Response');

/**
 * Sets up Socket.IO event handlers
 * @param {Object} io - Socket.IO server instance
 */
const setupSockets = (io) => {
  // Track active presenters and participants
  const activePresenters = new Map();
  const activeParticipants = new Map();

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    // Handle presenter joining their survey
    socket.on('presenterJoin', async (data) => {
      try {
        const { surveyId, userId } = data;
        
        // Store presenter info
        activePresenters.set(socket.id, { surveyId, userId });
        
        // Join presenter to survey room
        socket.join(`survey:${surveyId}`);
        socket.join(`presenter:${surveyId}`);
        
        console.log(`Presenter ${userId} joined survey ${surveyId}`);
        
        // Emit current participants count
        const participantCount = getParticipantCount(surveyId);
        socket.emit('participantCount', { count: participantCount });
        
        // You could load and send existing responses here
        // const responses = await Response.find({ surveyId });
        // socket.emit('existingResponses', responses);
      } catch (error) {
        console.error('Error in presenterJoin:', error);
        socket.emit('error', { message: 'Failed to join as presenter' });
      }
    });
    
    // Handle participant joining a survey
    socket.on('participantJoin', (data) => {
      try {
        const { surveyId, nickname } = data;
        
        // Store participant info
        activeParticipants.set(socket.id, { 
          surveyId, 
          nickname,
          joinedAt: new Date() 
        });
        
        // Join participant to survey room
        socket.join(`survey:${surveyId}`);
        socket.join(`participant:${surveyId}`);
        
        console.log(`Participant ${nickname} joined survey ${surveyId}`);
        
        // Notify presenter about new participant
        io.to(`presenter:${surveyId}`).emit('participantJoined', { 
          nickname,
          count: getParticipantCount(surveyId)
        });
      } catch (error) {
        console.error('Error in participantJoin:', error);
        socket.emit('error', { message: 'Failed to join survey' });
      }
    });
    
    // Handle response submission
    socket.on('submitResponse', async (data) => {
      try {
        const { surveyId, questionId, response } = data;
        const participant = activeParticipants.get(socket.id);
        
        if (!participant || participant.surveyId !== surveyId) {
          return socket.emit('error', { message: 'Not authorized to submit to this survey' });
        }
        
        // Add participant info to response
        const responseData = {
          surveyId,
          questionId,
          response,
          participant: {
            nickname: participant.nickname
          },
          timestamp: new Date()
        };
        
        // Save response to database (in a real implementation)
        // const savedResponse = await new Response(responseData).save();
        
        // Emit to presenters in real-time
        io.to(`presenter:${surveyId}`).emit('newResponse', responseData);
        
        // Emit to all participants for shared results views
        io.to(`participant:${surveyId}`).emit('responseUpdate', {
          questionId,
          // Send anonymized aggregate data
          aggregateData: calculateAggregateData(surveyId, questionId)
        });
        
        console.log(`Response submitted to survey ${surveyId}, question ${questionId}`);
      } catch (error) {
        console.error('Error in submitResponse:', error);
        socket.emit('error', { message: 'Failed to submit response' });
      }
    });
    
    // Handle presenter controlling survey flow
    socket.on('controlSurvey', (data) => {
      try {
        const { surveyId, action, questionId } = data;
        const presenter = activePresenters.get(socket.id);
        
        if (!presenter || presenter.surveyId !== surveyId) {
          return socket.emit('error', { message: 'Not authorized to control this survey' });
        }
        
        // Actions: 'start', 'next', 'previous', 'end', etc.
        switch (action) {
          case 'start':
            io.to(`survey:${surveyId}`).emit('surveyStarted', { surveyId });
            break;
          case 'next':
            io.to(`survey:${surveyId}`).emit('showQuestion', { questionId });
            break;
          case 'end':
            io.to(`survey:${surveyId}`).emit('surveyEnded', { surveyId });
            break;
          default:
            io.to(`survey:${surveyId}`).emit('surveyControl', { action, questionId });
        }
        
        console.log(`Survey ${surveyId} control: ${action}`);
      } catch (error) {
        console.error('Error in controlSurvey:', error);
        socket.emit('error', { message: 'Failed to control survey' });
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      try {
        // Handle presenter disconnect
        if (activePresenters.has(socket.id)) {
          const { surveyId, userId } = activePresenters.get(socket.id);
          console.log(`Presenter ${userId} disconnected from survey ${surveyId}`);
          activePresenters.delete(socket.id);
        }
        
        // Handle participant disconnect
        if (activeParticipants.has(socket.id)) {
          const { surveyId, nickname } = activeParticipants.get(socket.id);
          activeParticipants.delete(socket.id);
          
          // Update participant count for presenter
          io.to(`presenter:${surveyId}`).emit('participantLeft', { 
            nickname, 
            count: getParticipantCount(surveyId)
          });
          
          console.log(`Participant ${nickname} disconnected from survey ${surveyId}`);
        }
        
        console.log('Client disconnected:', socket.id);
      } catch (error) {
        console.error('Error handling disconnect:', error);
      }
    });
  });
  
  // Helper function to get participant count for a survey
  function getParticipantCount(surveyId) {
    let count = 0;
    activeParticipants.forEach(participant => {
      if (participant.surveyId === surveyId) count++;
    });
    return count;
  }
  
  // Helper function to calculate aggregate data for responses
  function calculateAggregateData(surveyId, questionId) {
    // In a real implementation, this would query the database
    // and calculate aggregate statistics
    return {
      totalResponses: 0,
      // Additional aggregated data would go here
    };
  }
};

module.exports = { setupSockets };