import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import VotingCard from '../components/audience/VotingCard';
import '../styles/participant-view.css';

const ParticipantView = () => {
  const { code } = useParams();
  const [survey, setSurvey] = useState(null);
  const [socket, setSocket] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [submitted, setSubmitted] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [surveyStatus, setSurveyStatus] = useState('waiting'); // waiting, active, ended
  const nickname = localStorage.getItem('participantNickname') || 'Anonymous';
  
  // Initialize socket and load survey
  useEffect(() => {
    const loadSurvey = async () => {
      try {
        // Get survey details
        const response = await axios.get(`http://localhost:3000/api/surveys/code/${code}`);
        setSurvey(response.data);
        
        // Connect to socket
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        
        // Join as participant
        newSocket.emit('participantJoin', { 
          surveyId: response.data._id, 
          nickname 
        });
        
        setLoading(false);
      } catch (err) {
        setError('Survey not found or no longer active');
        setLoading(false);
      }
    };
    
    loadSurvey();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [code, nickname]);
  
  // Socket event listeners
  useEffect(() => {
    if (!socket || !survey) return;
    
    socket.on('surveyStarted', () => {
      setSurveyStatus('active');
    });
    
    socket.on('surveyEnded', () => {
      setSurveyStatus('ended');
    });
    
    socket.on('showQuestion', (data) => {
      const question = survey.questions.find(q => q._id === data.questionId);
      if (question) {
        setCurrentQuestion(question);
      }
    });
    
    return () => {
      socket.off('surveyStarted');
      socket.off('surveyEnded');
      socket.off('showQuestion');
    };
  }, [socket, survey]);
  
  const handleSubmitResponse = (questionId, response) => {
    if (!socket || submitted[questionId]) return;
    
    socket.emit('submitResponse', {
      surveyId: survey._id,
      questionId,
      response
    });
    
    // Mark question as submitted
    setSubmitted(prev => ({
      ...prev,
      [questionId]: true
    }));
  };
  
  if (loading) {
    return <div className="loading">Joining survey...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!survey) {
    return <div className="error">Survey not found</div>;
  }
  
  return (
    <div className="participant-container">
      <div className="participant-header">
        <h1>{survey.title}</h1>
        <div className="participant-info">
          <span>Joined as: {nickname}</span>
        </div>
      </div>
      
      {surveyStatus === 'waiting' && (
        <div className="waiting-screen">
          <h2>Waiting for presenter to start...</h2>
          <div className="pulse-animation"></div>
        </div>
      )}
      
      {surveyStatus === 'active' && currentQuestion && (
        <div className="question-screen">
          {submitted[currentQuestion._id] ? (
            <div className="submitted-message">
              <h2>Response submitted!</h2>
              <p>Waiting for next question...</p>
            </div>
          ) : (
            <>
              {currentQuestion.type === 'multiple-choice' && (
                <VotingCard 
                  poll={{
                    question: currentQuestion.text,
                    options: currentQuestion.options.map(opt => ({
                      id: opt.value,
                      text: opt.text
                    })),
                    roomCode: code
                  }}
                  onVote={(optionId) => handleSubmitResponse(currentQuestion._id, optionId)}
                />
              )}
              
              {currentQuestion.type === 'open-ended' && (
                <div className="text-response">
                  <h2>{currentQuestion.text}</h2>
                  <textarea 
                    placeholder="Type your response here..."
                    maxLength="200"
                    rows="4"
                    id="responseText"
                  ></textarea>
                  <button 
                    onClick={() => {
                      const text = document.getElementById('responseText').value;
                      if (text.trim()) {
                        handleSubmitResponse(currentQuestion._id, text);
                      }
                    }}
                    className="submit-button"
                  >
                    Submit
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
      
      {surveyStatus === 'ended' && (
        <div className="ended-screen">
          <h2>Survey has ended</h2>
          <p>Thank you for your participation!</p>
        </div>
      )}
    </div>
  );
};

export default ParticipantView;