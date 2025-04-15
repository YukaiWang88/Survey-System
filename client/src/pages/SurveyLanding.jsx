import React from 'react';
import { useNavigate } from 'react-router-dom';
import PcSurveyButton from '../components/common/PcSurveyButton';
import PcParticipant from '../components/common/PcParticipant';
import '../styles/survey-landing.css';

const SurveyLanding = () => {
  const navigate = useNavigate();
  
  const handleCreateSurvey = () => {
    navigate('/login'); // Redirect to login before creating
  };
  
  const handleJoinSurvey = () => {
    navigate('/join/code'); // Navigate to the code entry page
  };
  
  return (
    <div className="admin-usertype">
      <div className="div-wrapper">
        <div className="text-wrapper">index.html</div>
      </div>

      <p className="QUIZLET">
        <span className="span">S</span>
        <span className="text-wrapper-2">urvey System</span>
      </p>

      <div className="frame-2">
        <PcSurveyButton 
          className="PC-survey-button-instance" 
          onClick={handleCreateSurvey}
        />
        <PcParticipant 
          onClick={handleJoinSurvey}
        />
      </div>

      <div className="PC-user">
        <img className="img" alt="User" src="/logo.png" />
      </div>
    </div>
  );
};

export default SurveyLanding;