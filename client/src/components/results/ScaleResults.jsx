import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from 'recharts';

const ScaleResults = ({ question, responses, totalParticipants }) => {
  if (!question || !responses) return null;

  // Process the scale responses (1-5 or whatever the scale is)
  const scaleMax = question.scaleMax || 5;
  const labels = [];
  
  // Initialize counts for each rating
  for (let i = 1; i <= scaleMax; i++) {
    labels.push(i);
  }
  
  // Count responses for each rating
  const data = labels.map(rating => {
    const count = responses.filter(r => Number(r.answer) === rating).length;
    return {
      name: rating.toString(),
      count,
      fill: '#78B9FF',
    };
  });

  // Calculate average rating
  const sum = responses.reduce((acc, r) => acc + (Number(r.answer) || 0), 0);
  const average = responses.length ? (sum / responses.length).toFixed(1) : 'N/A';

  return (
    <div className="results-container">
      <div className="results-header">
        <div className="average-rating">
          <span>Average Rating: <strong>{average}</strong></span>
          {question.minLabel && question.maxLabel && (
            <div className="scale-labels">
              <span>{question.minLabel}</span>
              <span>{question.maxLabel}</span>
            </div>
          )}
        </div>
      </div>
      
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
            <XAxis dataKey="name" tick={{ fill: '#3F3F3F', fontWeight: 600 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}> 
              <LabelList dataKey="count" position="top" fill="#3F3F3F" formatter={(value) => value} />
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ScaleResults;