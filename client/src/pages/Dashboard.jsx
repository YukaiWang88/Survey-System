import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import SurveyCard from '../components/common/SurveyCard';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use currentUser to verify authentication
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    const fetchSurveys = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:3000/api/surveys', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSurveys(response.data);
      } catch (err) {
        setError('Failed to fetch surveys');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSurveys();
  }, [currentUser, navigate]);

  const handleCreateNew = () => {
    navigate('/create');
  };
  
  const handlePresentSurvey = (surveyId) => {
    navigate(`/present/${surveyId}`);
  };
  
  const handleEditSurvey = (surveyId) => {
    navigate(`/edit/${surveyId}`);
  };
  
  const handleDeleteSurvey = async (surveyId) => {
    if (!window.confirm('Are you sure you want to delete this survey?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:3000/api/surveys/${surveyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove from state
      setSurveys(surveys.filter(survey => survey._id !== surveyId));
    } catch (err) {
      setError('Failed to delete survey');
      console.error(err);
    }
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">Loading your surveys...</div>
      </>
    );
  }
  
  return (
    <div className="dashboard-container">
      <Navbar />
      
      <div className="dashboard-content">
        <div className="dashboard-header">
          <h1>Your Surveys</h1>
          <button className="btn-primary create-btn" onClick={handleCreateNew}>
            Create New Survey
          </button>
        </div>
        
        {location.state?.message && (
          <div className="success-message">{location.state.message}</div>
        )}
        
        {error && <div className="error-message">{error}</div>}
        
        {surveys.length === 0 ? (
          <div className="empty-state">
            <h2>No surveys yet</h2>
            <p>Create your first survey to get started!</p>
            <button className="btn-primary" onClick={handleCreateNew}>
              Create Your First Survey
            </button>
          </div>
        ) : (
          <div className="surveys-grid">
            {surveys.map(survey => (
              <SurveyCard
                key={survey._id}
                survey={survey}
                onPresent={() => handlePresentSurvey(survey._id)}
                onEdit={() => handleEditSurvey(survey._id)}
                onDelete={() => handleDeleteSurvey(survey._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;