import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/join-survey.css';

const JoinSurvey = () => {
  const [code, setCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!code.trim()) {
      setError('Please enter a survey code');
      return;
    }
    
    if (!nickname.trim()) {
      setError('Please enter a nickname');
      return;
    }
    
    try {
      setLoading(true);
      
      // Check if the survey exists
      await axios.get(`http://localhost:3000/api/surveys/code/${code.trim()}`);
      
      // Store participant info in local storage
      localStorage.setItem('participantNickname', nickname.trim());
      
      // Navigate to the survey page
      navigate(`/survey/${code.trim()}`);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Survey not found. Please check the code and try again.');
      } else {
        setError('Failed to join survey. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="join-survey-container">
      <div className="join-card">
        <h1>Join a Survey</h1>
        <p>Enter the code provided by the presenter</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nickname">Your Name</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your name"
              maxLength="20"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="code">Survey Code</label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter survey code"
              maxLength="6"
              className="code-input"
            />
          </div>
          
          <button 
            type="submit" 
            className="join-button"
            disabled={loading}
          >
            {loading ? 'Joining...' : 'Join'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JoinSurvey;