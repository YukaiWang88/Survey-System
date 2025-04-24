import React, { useState } from 'react';

const ParticipantMC = ({ question, answer, onAnswerChange, participants}) => {

  const [selected, setSelected] = useState(null); 

  if (participants == 0) {
    return (<div  style={{textAlign: "center", color: "#cc3333"}} /* soft red */>
      no answers yet
    </div>)
  }
  
  // Function to handle option selection
  const handleOptionSelect = (option) => {
    console.log("Selected option:", option);
    setSelected(option);
    onAnswerChange(option);
  };

   

  // If question has no options, show a message
  if (!question.options || question.options.length === 0) {
    return (
      <div className="question-container">
        <h3 className="question-title">{question.title}</h3>
        <p className="text-muted">This question has no options.</p>
      </div>
    );
  }

  return (
    <div className="question-container">
      <h3 className="question-title">{question.title}</h3>
      
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

export default ParticipantMC;