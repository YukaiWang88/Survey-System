import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import ResultsChart from '../components/presenter/ResultsChart';
import ParticipantCounter from '../components/presenter/ParticipantCounter';
import QRCode from '../components/presenter/QRCode';
import '../styles/present-survey.css';

const PresentSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [participantCount, setParticipantCount] = useState(0);
  const [responses, setResponses] = useState({});
  const [socket, setSocket] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Initialize socket and load survey
  useEffect(() => {
    if (!surveyId) {
      navigate('/dashboard');
      return;
    }
    
    const loadSurvey = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`http://localhost:3000/api/surveys/${surveyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSurvey(response.data);
        
        // Initialize empty response state
        const initialResponses = {};
        response.data.questions.forEach(q => {
          initialResponses[q._id] = [];
        });
        setResponses(initialResponses);
        
        // Connect to socket
        const newSocket = io('http://localhost:3000');
        setSocket(newSocket);
        
        // Join as presenter
        newSocket.emit('presenterJoin', { 
          surveyId, 
          userId: 'current-user-id' // Would be from auth context
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to load survey');
        setLoading(false);
      }
    };
    
    loadSurvey();
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [surveyId, navigate]);
  
  // Socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    socket.on('participantCount', (data) => {
      setParticipantCount(data.count);
    });
    
    socket.on('participantJoined', (data) => {
      setParticipantCount(data.count);
    });
    
    socket.on('participantLeft', (data) => {
      setParticipantCount(data.count);
    });
    
    socket.on('newResponse', (data) => {
      setResponses(prev => {
        const questionResponses = [...(prev[data.questionId] || [])];
        questionResponses.push(data.response);
        return { ...prev, [data.questionId]: questionResponses };
      });
    });
    
    return () => {
      socket.off('participantCount');
      socket.off('participantJoined');
      socket.off('participantLeft');
      socket.off('newResponse');
    };
  }, [socket]);
  
  const startSurvey = () => {
    setIsActive(true);
    socket.emit('controlSurvey', {
      surveyId,
      action: 'start',
      questionId: survey.questions[currentQuestionIndex]._id
    });
  };
  
  const endSurvey = () => {
    setIsActive(false);
    socket.emit('controlSurvey', {
      surveyId,
      action: 'end'
    });
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      
      socket.emit('controlSurvey', {
        surveyId,
        action: 'next',
        questionId: survey.questions[nextIndex]._id
      });
    }
  };
  
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      
      socket.emit('controlSurvey', {
        surveyId,
        action: 'previous',
        questionId: survey.questions[prevIndex]._id
      });
    }
  };
  
  if (loading) {
    return <div className="loading">Loading survey...</div>;
  }
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!survey) {
    return <div className="error">Survey not found</div>;
  }
  
  const currentQuestion = survey.questions[currentQuestionIndex];
  const currentResponses = responses[currentQuestion._id] || [];
  const joinUrl = `${window.location.origin}/survey/${survey.code}`;
  
  return (
    <div className="present-container">
      <div className="presentation-header">
        <h1>{survey.title}</h1>
        <div className="survey-code">
          <span>Join at:</span>
          <strong>{window.location.host}/join</strong>
          <span>Code:</span>
          <strong>{survey.code}</strong>
        </div>
        <ParticipantCounter count={participantCount} />
      </div>
      
      <div className="presentation-body">
        <div className="question-display">
          <h2>{currentQuestion.text}</h2>
          {currentQuestion.type === 'multiple-choice' && (
            <div className="options-list">
              {currentQuestion.options.map((option, i) => (
                <div key={i} className="option-item">
                  <span>{option.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="results-display">
          <ResultsChart 
            questionType={currentQuestion.type} 
            responses={currentResponses}
            options={currentQuestion.options}
          />
        </div>
        
        <div className="qr-display">
          <QRCode value={joinUrl} />
          <div className="qr-label">Scan to join</div>
        </div>
      </div>
      
      <div className="presentation-controls">
        <button 
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          className="btn-secondary"
        >
          Previous
        </button>
        
        {!isActive ? (
          <button 
            onClick={startSurvey}
            className="btn-primary start-button"
          >
            Start Survey
          </button>
        ) : (
          <button 
            onClick={endSurvey}
            className="btn-danger end-button"
          >
            End Survey
          </button>
        )}
        
        <button 
          onClick={nextQuestion}
          disabled={currentQuestionIndex === survey.questions.length - 1}
          className="btn-secondary"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PresentSurvey;