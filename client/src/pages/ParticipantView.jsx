import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SocketContext } from '../contexts/SocketContext';
import '../styles/participant-view.css';

// Question Components
import MCQuestion from '../components/questions/MCQuestion';
import ScaleQuestion from '../components/questions/ScaleQuestion';
import WordCloudQuestion from '../components/questions/WordCloudQuestion';
import InstructionSlide from '../components/questions/InstructionSlide';
import QuizMCQuestion from '../components/questions/QuizMCQuestion';

const ParticipantView = () => {
  const { surveyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  
  const [survey, setSurvey] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [showProgress, setShowProgress] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [feedback, setFeedback] = useState(null);
  
  const participantId = location.state?.participantId;
  const nickname = location.state?.nickname || 'Anonymous';

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/surveys/code/${surveyId}`);
        setSurvey(response.data);
      } catch (err) {
        setError('Survey not found or has expired');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurvey();
    
    // Socket connection
    if (socket) {
      socket.emit('join-survey', { surveyId, participantId, nickname });
      
      socket.on('question-change', (data) => {
        setCurrentQuestionIndex(data.questionIndex);
        setShowAnswer(false);
        setFeedback(null);
      });
      
      socket.on('show-answer', (data) => {
        setShowAnswer(true);
      });
      
      socket.on('hide-answer', () => {
        setShowAnswer(false);
      });
      
      socket.on('survey-end', () => {
        navigate('/survey/complete', { 
          state: { surveyTitle: survey?.title } 
        });
      });
      
      return () => {
        socket.off('question-change');
        socket.off('show-answer');
        socket.off('hide-answer');
        socket.off('survey-end');
      };
    }
  }, [surveyId, socket, participantId, nickname, navigate, survey?.title]);

  const handleAnswerChange = (answer) => {
    if (!survey) return;
    
    const question = survey.questions[currentQuestionIndex];
    const questionId = question.id;
    
    const updatedAnswers = {
      ...answers,
      [questionId]: answer
    };
    
    setAnswers(updatedAnswers);
    setFeedback(null);
    
    if (socket && participantId) {
      socket.emit('submit-answer', {
        surveyId,
        questionId,
        answer,
        participantId
      });
    }
    
    // If it's a quiz question, check if answer is correct
    if (question.type === 'quiz-mc' && showAnswer) {
      const selectedOption = question.options.find(o => o.id === answer);
      if (selectedOption) {
        setFeedback({
          isCorrect: selectedOption.isCorrect,
          explanation: selectedOption.isCorrect 
            ? (question.explanation || 'Correct!') 
            : (question.explanation || 'That was not the correct answer.')
        });
      }
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setFeedback(null);
      
      // Notify server about navigation
      if (socket && participantId) {
        socket.emit('participant-next', {
          surveyId,
          participantId
        });
      }
    } else {
      // End of survey
      navigate('/survey/complete', { 
        state: { surveyTitle: survey?.title } 
      });
    }
  };

  const isQuizQuestion = (question) => {
    return question?.type?.startsWith('quiz-');
  };

  const isAnswerSelected = () => {
    if (!survey) return false;
    
    const question = survey.questions[currentQuestionIndex];
    const questionId = question.id;
    const answer = answers[questionId];
    
    if (question.type === 'multiple-choice' && question.allowMultiple) {
      return Array.isArray(answer) && answer.length > 0;
    }
    
    return answer !== undefined && answer !== '';
  };

  if (loading) {
    return <div className="loading">Loading survey...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!survey || survey.questions.length === 0) {
    return <div className="error-container">No questions found in this survey.</div>;
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const totalQuestions = survey.questions.length;
  const progress = `${currentQuestionIndex + 1}/${totalQuestions}`;

  return (
    <div className="participant-view">
      <div className="participant-header">
        <h1>{survey.title}</h1>
        {showProgress && (
          <div className="question-progress">{progress}</div>
        )}
      </div>
      
      <div className="question-container">
        {currentQuestion.type === 'multiple-choice' && (
          <MCQuestion
            question={currentQuestion}
            answer={answers[currentQuestion.id] || (currentQuestion.allowMultiple ? [] : '')}
            onAnswerChange={handleAnswerChange}
            showResults={false}
          />
        )}
        
        {currentQuestion.type === 'quiz-mc' && (
          <QuizMCQuestion
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ''}
            onAnswerChange={handleAnswerChange}
            showAnswer={showAnswer}
            feedback={feedback}
          />
        )}
        
        {currentQuestion.type === 'word-cloud' && (
          <WordCloudQuestion
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ''}
            onAnswerChange={handleAnswerChange}
          />
        )}
        
        {currentQuestion.type === 'scale' && (
          <ScaleQuestion
            question={currentQuestion}
            answer={answers[currentQuestion.id] || ''}
            onAnswerChange={handleAnswerChange}
            showResults={false}
          />
        )}
        
        {currentQuestion.type === 'instruction' && (
          <InstructionSlide
            content={currentQuestion}
            onContinue={handleNext}
          />
        )}
      </div>
      
      {currentQuestion.type !== 'instruction' && (
        <div className="question-actions">
          <button 
            className="btn-next"
            onClick={handleNext}
            disabled={currentQuestion.required && !isAnswerSelected()}
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantView;