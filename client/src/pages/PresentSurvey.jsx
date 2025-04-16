import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../contexts/SocketContext';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import MCResults from '../components/results/MCResults';
import WordCloudResults from '../components/results/WordCloudResults';
import ScaleResults from '../components/results/ScaleResults';
import QuizResults from '../components/results/QuizResults';
import '../styles/present-survey.css';

const PresentSurvey = () => {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { currentUser } = useContext(AuthContext);
  
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [participants, setParticipants] = useState([]);
  const [showingQuestion, setShowingQuestion] = useState(true);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [surveyCode, setSurveyCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchSurvey = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`http://localhost:3000/api/surveys/${surveyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.data) {
        throw new Error('Empty response received');
      }
      
      setSurvey(response.data);
      
      // Get or generate survey code
      const codeResponse = await axios.post(
        `http://localhost:3000/api/surveys/${surveyId}/generate-code`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSurveyCode(codeResponse.data.code);
    } catch (err) {
      console.error('Error details:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Failed to load survey: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`Error fetching survey: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
    };
    
    fetchSurvey();
    
    // Socket setup
    if (socket) {
      socket.emit('presenter-join', { surveyId });
      
      socket.on('participant-joined', (data) => {
        setParticipants(prev => [...prev, data.participant]);
      });
      
      socket.on('participant-left', (data) => {
        setParticipants(prev => prev.filter(p => p.id !== data.participantId));
      });
      
      socket.on('new-response', (data) => {
        setResponses(prev => {
          const questionResponses = prev[data.questionId] || [];
          
          // Check if this participant already responded
          const existingIndex = questionResponses.findIndex(
            r => r.participantId === data.participantId
          );
          
          if (existingIndex >= 0) {
            // Update existing response
            const updatedResponses = [...questionResponses];
            updatedResponses[existingIndex] = {
              participantId: data.participantId,
              answer: data.answer,
              timestamp: Date.now()
            };
            return {
              ...prev,
              [data.questionId]: updatedResponses
            };
          }
          
          // Add new response
          return {
            ...prev,
            [data.questionId]: [
              ...questionResponses,
              {
                participantId: data.participantId,
                answer: data.answer,
                timestamp: Date.now()
              }
            ]
          };
        });
      });
      
      return () => {
        socket.emit('presenter-leave', { surveyId });
        socket.off('participant-joined');
        socket.off('participant-left');
        socket.off('new-response');
      };
    }
  }, [currentUser, navigate, socket, surveyId]);
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowingAnswer(false);
      
      if (socket) {
        socket.emit('change-question', {
          surveyId,
          questionIndex: currentQuestionIndex + 1,
          questionId: currentQuestionIndex + 1
        });
      }
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowingAnswer(false);
      
      if (socket) {
        socket.emit('change-question', {
          surveyId,
          questionIndex: currentQuestionIndex - 1
        });
      }
    }
  };
  
  const toggleShowQuestion = () => {
    setShowingQuestion(!showingQuestion);
    
    if (socket) {
      socket.emit(showingQuestion ? 'hide-question' : 'show-question', {
        surveyId
      });
    }
  };
  
  const toggleShowAnswer = () => {
    setShowingAnswer(!showingAnswer);
    
    if (socket) {
      socket.emit(showingAnswer ? 'hide-answer' : 'show-answer', {
        surveyId
      });
    }
  };


  const endPresentation = () => {
    if (socket) {
      socket.emit('end-survey', { surveyId });
    }
    navigate('/dashboard');
  };
  
  const isQuizQuestion = () => {
    if (!survey) return false;
    return survey.questions[currentQuestionIndex].type.startsWith('quiz-');
  };
  
  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="loading">Loading presentation...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div>
        <Navbar />
        <div className="error-container">{error}</div>
      </div>
    );
  }
  
  if (!survey) {
    return (
      <div>
        <Navbar />
        <div className="error-container">Survey not found</div>
      </div>
    );
  }
  
  const currentQuestion = survey.questions[currentQuestionIndex];
  const currentResponses = responses[currentQuestionIndex] || [];
  const responseRate = participants.length > 0 
    ? Math.round((currentResponses.length / participants.length) * 100)
    : 0;
  
  return (
    <div className="present-survey-container">
      <Navbar />
      
      <div className="presentation-header">
        <div className="survey-info">
          <h1>{survey.title}</h1>
          <div className="survey-code">
            Join code: <span>{surveyCode}</span>
          </div>
        </div>
        
        <div className="participant-count">
          <span>{participants.length}</span> Participants
        </div>
      </div>
      
      <div className="presentation-content">
        <div className="question-section">
          <div className="question-navigation">
            <button 
              onClick={handlePreviousQuestion} 
              disabled={currentQuestionIndex === 0}
              className="nav-btn"
            >
              ← Previous
            </button>
            
            <div className="question-progress">
              Question {currentQuestionIndex + 1} of {survey.questions.length}
            </div>
            
            <button 
              onClick={handleNextQuestion} 
              disabled={currentQuestionIndex === survey.questions.length - 1}
              className="nav-btn"
            >
              Next →
            </button>
          </div>
          
          <div className="question-display">
            <h2>{currentQuestion.title}</h2>
          </div>
          
            <div className="results-container">
              {currentQuestion.type === 'mc' && (
                <MCResults 
                  question={currentQuestion}
                  responses={currentResponses}
                  totalParticipants={participants.length}
                />
              )}
              
              {currentQuestion.type === 'quiz-mc' && (
                <QuizResults 
                  question={currentQuestion}
                  responses={currentResponses}
                  totalParticipants={participants.length}
                  showAnswer={showingAnswer}
                />
              )}
              
              {currentQuestion.type === 'wordcloud' && (
                <WordCloudResults 
                  responses={currentResponses}
                />
              )}
              
              {currentQuestion.type === 'scale' && (
                <ScaleResults 
                  question={currentQuestion}
                  responses={currentResponses}
                  totalParticipants={participants.length}
                />
              )}
              
              {currentQuestion.type === 'instruction' && (
                <div className="instruction-display">
                  <p>{currentQuestion.content || 'This is an instruction slide. No responses needed.'}</p>
                </div>
              )}
            </div>
        </div>
        
        <div className="presentation-sidebar">
          <div className="response-metrics">
            <div className="metric">
              <span className="metric-label">Response Rate</span>
              <span className="metric-value">{responseRate}%</span>
            </div>
            <div className="metric">
              <span className="metric-label">Responses</span>
              <span className="metric-value">{currentResponses.length}/{participants.length}</span>
            </div>
          </div>
          
          <div className="presentation-controls">
            <button 
              className={`control-btn ${showingQuestion ? 'active' : ''}`}
              onClick={toggleShowQuestion}
            >
              {showingQuestion ? 'Hide Question' : 'Show Question'}
            </button>
            
            {isQuizQuestion() && (
              <button 
                className={`control-btn ${showingAnswer ? 'active' : ''}`}
                onClick={toggleShowAnswer}
              >
                {showingAnswer ? 'Hide Answer' : 'Show Answer'}
              </button>
            )}
            
            <button 
              className="control-btn end-btn"
              onClick={endPresentation}
            >
              End Presentation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PresentSurvey;