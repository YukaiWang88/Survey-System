import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import '../styles/participate-survey.css';

const ParticipateSurvey = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  
  // Get participant data from location state
  const participantId = location.state?.participantId;
  const nickname = location.state?.nickname || 'Anonymous';
  
  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await API.get(`/join/survey/${id}`);
        setSurvey(response.data);
        
        // Initialize answers object
        const initialAnswers = {};
        response.data.questions.forEach(q => {
          initialAnswers[q._id] = q.type === 'multiple-choice' ? '' : '';
        });
        setAnswers(initialAnswers);
      } catch (err) {
        console.error('Error fetching survey:', err);
        setError(err.response?.data?.message || 'Survey not found or has expired');
      } finally {
        setLoading(false);
      }
    };
    
    if (!participantId) {
      // Redirect if no participant ID (direct URL access)
      navigate('/join');
      return;
    }
    
    fetchSurvey();
  }, [id, participantId, navigate]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Submit answers
  };
  
  if (loading) return <div className="loading">Loading survey...</div>;
  if (error) return <div className="error-container">{error}</div>;
  if (!survey) return <div className="error-container">Survey not found</div>;
  
  return (
    <div className="participate-container">
      <div className="participate-header">
        <h1>{survey.title}</h1>
        <p>Participating as: {nickname}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {survey.questions.map(question => (
          <div key={question._id} className="question-container">
            <h3>{question.text}</h3>
            {/* Render different question types */}
          </div>
        ))}
        
        <button type="submit" className="btn-primary">
          Submit Answers
        </button>
      </form>
    </div>
  );
};

export default ParticipateSurvey;