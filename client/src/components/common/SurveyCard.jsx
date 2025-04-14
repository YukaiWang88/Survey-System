import React from 'react';
import { format } from 'date-fns';
import { FaPlay, FaEdit, FaTrash } from 'react-icons/fa';
import '../../styles/survey-card.css';

const SurveyCard = ({ survey, onPresent, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };
  
  return (
    <div className="survey-card">
      <div className="survey-card-header">
        <h3>{survey.title}</h3>
        <span className="survey-code">CODE: {survey.code}</span>
      </div>
      
      <div className="survey-card-body">
        <p className="survey-description">
          {survey.description || 'No description provided'}
        </p>
        
        <div className="survey-meta">
          <span className="question-count">
            {survey.questions.length} question{survey.questions.length !== 1 ? 's' : ''}
          </span>
          <span className="created-date">
            Created: {formatDate(survey.createdAt)}
          </span>
        </div>
      </div>
      
      <div className="survey-card-actions">
        <button 
          className="card-action present-action" 
          onClick={onPresent}
          title="Present"
        >
          <FaPlay />
          <span>Present</span>
        </button>
        
        <button 
          className="card-action edit-action" 
          onClick={onEdit}
          title="Edit"
        >
          <FaEdit />
          <span>Edit</span>
        </button>
        
        <button 
          className="card-action delete-action" 
          onClick={onDelete}
          title="Delete"
        >
          <FaTrash />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default SurveyCard;