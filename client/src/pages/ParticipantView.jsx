import React, { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../utils/api';
import { SocketContext } from '../contexts/SocketContext';
import '../styles/participant-view.css';
import '../styles/participate-survey.css';

// Question Components
import MCQuestion from '../components/questions/MCQuestion';
import ScaleQuestion from '../components/questions/ScaleQuestion';
import WordCloudQuestion from '../components/questions/WordCloudQuestion';
import InstructionSlide from '../components/questions/InstructionSlide';
import QuizMCQuestion from '../components/questions/QuizMCQuestion';

// Import these or create them
import ParticipantWordCloud from '../components/participant/ParticipantWordCloud';
import ParticipantMC from '../components/participant/ParticipantMC';

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
        const response = await API.get(`/surveys/code/${surveyId}`);
        setSurvey(response.data);

        // console.log(response);

        // answer list
        const answerList = response.data.questions.map(({ _id, type, results }) => ({
          _id,
          type,
          results,
          answered: false
        }));
      
      
        const objectAnswerList = answerList.map(item => ({
          ...item,
          results: item.results instanceof Map
            ? Object.fromEntries(item.results)
            : item.results
        }));

        setAnswers(objectAnswerList);
        
        // console.log(JSON.stringify(printableAnswerList, null, 2));
        
      } catch (err) {
        setError('Survey not found or has expired');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurvey();

    // parse_survey_ge

    // Socket connection
    // if (socket) {
    //   socket.emit('join-survey', { surveyId, participantId, nickname });
      
    //   socket.on('question-change', (data) => {
    //     setCurrentQuestionIndex(data.questionIndex);
    //     setShowAnswer(false);
    //     setFeedback(null);
    //   });
      
    //   socket.on('show-answer', (data) => {
    //     setShowAnswer(true);
    //   });
      
    //   socket.on('hide-answer', () => {
    //     setShowAnswer(false);
    //   });
      
    //   socket.on('survey-end', () => {
    //     navigate('/survey/complete', { 
    //       state: { surveyTitle: survey?.title } 
    //     });
    //   });
      
    //   return () => {
    //     socket.off('question-change');
    //     socket.off('show-answer');
    //     socket.off('hide-answer');
    //     socket.off('survey-end');
    //   };
    // }
  }, [surveyId, socket, participantId, nickname, navigate, survey?.title]);



  const handleAnswerChange = (answer) => {
    if (!survey) return;
    
    const question = survey.questions[currentQuestionIndex];
    // const questionId = question.id;

    
    if (answers[currentQuestionIndex].results.hasOwnProperty(answer)) {
      answers[currentQuestionIndex].results[answer] = 1;
    } else {
      if (survey.questions[currentQuestionIndex].type != 'wordcloud' && survey.questions[currentQuestionIndex].type != 'word-cloud') {
        throw new Error(`Invalid answer: key "${answer}" not found in results.`);
      } else {
        answers[currentQuestionIndex].results[answer] = 1;
      }
      
    }

    answers[currentQuestionIndex].answered = true;

    setAnswers(answers);

    console.log("set answer:", answers);
    // setFeedback(null);
    
    // if (socket && participantId) {
    //   socket.emit('submit-answer', {
    //     surveyId,
    //     questionId,
    //     answer,
    //     participantId
    //   });
    // }
    
    // If it's a quiz question, check if answer is correct
    // if (question.type === 'quiz-mc' && showAnswer) {
    //   const selectedOption = question.options.find(o => o.id === answer);
    //   if (selectedOption) {
    //     setFeedback({
    //       isCorrect: selectedOption.isCorrect,
    //       explanation: selectedOption.isCorrect 
    //         ? (question.explanation || 'Correct!') 
    //         : (question.explanation || 'That was not the correct answer.')
    //     });
    //   }
    // }
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setFeedback(null);
      
      // Notify server about navigation
      // if (socket && participantId) {
      //   socket.emit('participant-next', {
      //     surveyId,
      //     participantId
      //   });
      // }
    } else {
      // End of survey
      try {
        const payload = {
          surveyId,       // Assuming surveyId is already defined
          answers,        // Your list of answers
          participantId,         // Any other variable you need to send
          // timestamp: new Date().toISOString(), // Example of extra metadata
        };
    
        API.post(`/answer`, payload);
    
        // Optionally, you could set response data or confirm submission
        // setSurvey(response.data);
    
        navigate('/survey/complete', {
          state: { surveyTitle: survey?.title }
        });
      } catch (error) {
        console.error('Failed to submit survey results:', error);
        // Handle error (e.g., show message to user)
      }
    }

  };

  const isQuizQuestion = (question) => {
    return question?.type?.startsWith('quiz-');
  };

  const isAnswerSelected = () => {
    // if (!survey) return false;
    
    // const question = survey.questions[currentQuestionIndex];
    // const questionId = question.id;
    // const answer = answers[questionId];
    
    // if (question.type === 'multiple-choice' && question.allowMultiple) {
    //   return Array.isArray(answer) && answer.length > 0;
    // }
    
    // return answer !== undefined && answer !== '';
    return  true;
  };

  // New function to render the right component based on question type
  const renderQuestion = () => {
    if (!survey || !survey.questions || survey.questions.length === 0) {
      return <div>No questions available</div>;
    }
    
    const currentQuestion = survey.questions[currentQuestionIndex];

    const currentResult = answers[currentQuestionIndex].results;

    console.log(`currentResult: ${JSON.stringify(currentResult, null, 2)}`);

    let currentAnswer='';

    for (const [key, value] of Object.entries(currentResult)) {
      if (value === 1) {
        currentAnswer = key;  // Output: "b"
        break;             // Stop after the first match
      }
    }

    console.log(`currentAnswer ${currentAnswer}`)

    // if (answers[currentQuestionIndex].results.hasOwnProperty(answer)) {
    //   answers[currentQuestionIndex].results[answer] += 1;
    // } else {
    //   throw new Error(`Invalid answer: key "${answer}" not found in results.`);
    // }

    
    
    console.log('Rendering question type:', currentQuestion.type);
    
    switch (currentQuestion.type) {
      case 'wordcloud':
      case 'word-cloud':
        return (
          <ParticipantWordCloud
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
          />
        );
        
      case 'multiple-choice':
      case 'mc':
        return (
          <ParticipantMC
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
          />
        );
        
      case 'instruction':
        return (
          <InstructionSlide
            question={currentQuestion}
            // onContinue={handleNext}
          />
        );
        
      case 'scale':
        // return (
        //   <ScaleQuestion
        //     question={currentQuestion}
        //     answer={currentAnswer}
        //     onAnswerChange={handleAnswerChange}
        //     showResults={false}
        //   />
        // );

        return (
          <ScaleQuestion
            question={currentQuestion}
            currentAnswer={currentAnswer}
            onChange={handleAnswerChange}
          />
        )
        
      case 'quiz-mc':
        return (
          <QuizMCQuestion
            question={currentQuestion}
            answer={currentAnswer}
            onAnswerChange={handleAnswerChange}
            // showAnswer={showAnswer}
            // feedback={feedback}
          />
        );
        
      default:
        return (
          <div className="question-container">
            <h3 className="question-title">Unsupported Question Type</h3>
            <p>This question type ({currentQuestion.type}) is not supported in participation view.</p>
          </div>
        );
    }
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


      {/* Use the renderQuestion function here instead of conditionals */}
      {renderQuestion()}
      
      {survey.questions[currentQuestionIndex].type !== 'instruction' && (
        <div className="question-actions">
          <button 
            className="btn-next"
            onClick={handleNext}
            disabled={survey.questions[currentQuestionIndex].required && !isAnswerSelected()}
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ParticipantView;