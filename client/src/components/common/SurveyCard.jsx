import React from 'react';
import { FaPlay, FaEdit, FaTrash } from 'react-icons/fa';

const SurveyCard = ({ survey, onPresent, onEdit, onDelete }) => {
  // Format the date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="survey-card">
      <div className="survey-card-content">
        <h3 className="survey-card-title">{survey.title}</h3>
        
        <p className="survey-card-description">
          {survey.description || 'No description provided'}
        </p>
        
        <div className="survey-card-meta">
          <div className="survey-code">
            Code: <span>{survey.code || 'N/A'}</span>
          </div>
          <div className="survey-date">
            {formatDate(survey.createdAt)}
          </div>
        </div>
        
        <div className="survey-card-actions">
          <button 
            className="btn-present" 
            onClick={onPresent}
            aria-label="Present survey"
          >
            <FaPlay style={{marginRight: '4px'}} /> Present
          </button>
          
          <button 
            className="btn-edit" 
            onClick={onEdit}
            aria-label="Edit survey"
          >
            <FaEdit style={{marginRight: '4px'}} /> Edit
          </button>
          
          <button 
            className="btn-delete" 
            onClick={onDelete}
            aria-label="Delete survey"
          >
            <FaTrash style={{marginRight: '4px'}} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyCard;