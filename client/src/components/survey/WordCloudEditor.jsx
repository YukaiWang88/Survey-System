import React from 'react';

const WordCloudEditor = ({ question, updateQuestion }) => {
  const handleQuestionTextChange = (e) => {
    updateQuestion({ ...question, text: e.target.value });
  };
  
  const handleMaxWordsChange = (e) => {
    const maxWords = parseInt(e.target.value) || 0;
    updateQuestion({ ...question, maxWords });
  };
  
  const handleMaxLengthChange = (e) => {
    const maxLength = parseInt(e.target.value) || 0;
    updateQuestion({ ...question, maxLength });
  };
  
  return (
    <div className="question-editor">
      <h2>Word Cloud Question</h2>
      
      <div className="form-group">
        <label htmlFor="question-text">Question Text</label>
        <input
          id="question-text"
          type="text"
          value={question.text}
          onChange={handleQuestionTextChange}
          placeholder="Enter your question"
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="max-words">Maximum Words (0 for unlimited)</label>
        <input
          id="max-words"
          type="number"
          value={question.maxWords}
          onChange={handleMaxWordsChange}
          min="0"
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="max-length">Maximum Characters (0 for unlimited)</label>
        <input
          id="max-length"
          type="number"
          value={question.maxLength}
          onChange={handleMaxLengthChange}
          min="0"
          className="form-control"
        />
      </div>
      
      <div className="form-group">
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="required-question"
            checked={question.required}
            onChange={() => updateQuestion({ ...question, required: !question.required })}
          />
          <label htmlFor="required-question">Required question</label>
        </div>
      </div>
    </div>
  );
};

export default WordCloudEditor;