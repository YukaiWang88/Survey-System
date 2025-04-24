import React, { useState } from 'react';


export const QuizQuestion = ({ 
    question = {}, 
    answer,
    onAnswerChange, 
  }) => {

    const [selected, setSelected] = useState(null); 

    // Function to handle option selection
    const handleOptionSelect = (option) => {
      console.log("Selected option:", option);
      setSelected(option);
      onAnswerChange(option);
    };

    return (
      <div className="question-item quiz" style={{ width: '50%', margin: 20}}>
 
        <div>
          <h2>{question.title}</h2>
        </div>
            
        {/* <div className="options-list">
          {(question.options || []).map((option, optIndex) => (
            <div className="option-item" key={optIndex}>
              <input
                type="text"
                value={option.text || ''}
                onChange={(e) => onChange('optionText', index, e.target.value, optIndex)}
                placeholder={`Option ${optIndex + 1}`}
              />
              <label className="correct-answer">
                <input
                  type="radio"
                  name={`correct-${index}`}
                  checked={option.isCorrect || false}
                  onChange={() => onChange('setCorrect', index, null, optIndex)}
                />
                Correct
              </label>
              <button 
                type="button" 
                className="remove-option-btn"
                onClick={() => onChange('removeOption', index, null, optIndex)}
              >
                ×
              </button>
            </div>
          ))}
          <button 
            type="button" 
            className="add-option-btn"
            onClick={() => onChange('addOption', index)}
          >
            + Add Option
          </button>
        </div> */}

      <div className="mc-options">
        {question.options.map((option, index) => {
          // For debugging
          console.log("Option:", option);
          console.log("Checking if", answer, "===", option.text);
          
          return (
            <div key={option.text} className="mc-option">
              <div className="form-check option-item">
                <input
                  className="form-check-input"
                  type="radio"
                  id={`option-${question.id || 'q'}-${index}`}
                  name={`question-${question.id || 'q'}`}
                  checked={selected === (option.text)}
                  onChange={() => handleOptionSelect(option.text)}
                />
                <label 
                  className="form-check-label" 
                  htmlFor={`option-${question.id || 'q'}-${index}`}
                >
                  {option.text}
                </label>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    );
  };

export default QuizQuestion;
