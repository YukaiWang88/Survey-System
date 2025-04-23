import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell, PieChart, Pie, Legend } from 'recharts';

const QuizResults = ({ question, responses, showAnswer}) => {
  if (!responses || !question ) return null;
  // responses = {"A": 7, "B": 3};

  const correctOptionText = question.options.find(option => option.isCorrect)?.text;

  console.log("correct answer: ", correctOptionText);


  const data = Object.entries(responses).map(([key, value]) => {
    return {
      name: key,
      value,
      fill: key === correctOptionText ? '#0062B2' : '#cccccc',
      textColor: key === correctOptionText ? '#0062B2' : '#cccccc'
    };
  });
  
  let correctCount = 0;
  let wrongCount = 0;

  for (const option of question.options) {
    const count = responses[option.text] || 0;
    if (option.isCorrect) {
      correctCount += count;
    } else {
      wrongCount += count;
    }
  }


  return (
    <div className="results-container">
      <div className="results-header quiz-header" style={{ display: showAnswer ? 'block' : 'none' }}>
          <div className="answer-item" >
            <span>Correct Answers Is: <strong>{correctOptionText}</strong></span>
          </div>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" tick={{ fill: '#3F3F3F', fontWeight: 600 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}> 
              <LabelList dataKey="value" position="top" fill="fill" formatter={(value) => value} />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
     {/* Pie chart showing correct/incorrect ratio */}
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie 
              data={data} 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              dataKey="value" 
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default QuizResults;