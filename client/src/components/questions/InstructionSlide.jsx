import React from 'react';
export const InstructionSlide = ({ 
    question = {}, 
    onChange, 
    index 
  }) => {
    // console.log("Instruction: ", question.title);
    return (
      <div style={{ width: '50%', height: 300 }} className="question-item instruction" >
        <div className="question-header">
          <span className="question-type-label">Instruction</span>
          {/* <div className="question-actions">
            <button type="button" className="action-btn" onClick={() => onChange('moveUp', index)}>↑</button>
            <button type="button" className="action-btn" onClick={() => onChange('moveDown', index)}>↓</button>
            <button type="button" className="action-btn delete" onClick={() => onChange('delete', index)}>×</button>
          </div> */}
        </div>
        
        <div style={{ fontSize: '30px', }}>
          {question.title || 'Title'}
        </div>
        <br></br>
        <div>
          {question.content || 'Content'}
        </div>
      </div>
    );
  };

export default InstructionSlide;