// import React from 'react';
// export const ScaleQuestion = ({ 
//   question = {}, 
//   onChange, 
//   index 
// }) => {
//   return (
//     <div style={{ width: '50%', height: 300 }} className="question-item scale">
//       <div className="question-header">
//         <span className="question-type-label">Scale</span>
//         {/* <div className="question-actions">
//           <button type="button" className="action-btn" onClick={() => onChange('moveUp', index)}>↑</button>
//           <button type="button" className="action-btn" onClick={() => onChange('moveDown', index)}>↓</button>
//           <button type="button" className="action-btn delete" onClick={() => onChange('delete', index)}>×</button>
//         </div> */}
//       </div>
      
//       <div style={{ fontSize: '30px', }}>
//           {question.title || 'Title'}
//         </div>
//         <br></br>
      
//       <div className="scale-settings">
//         <div className="setting-group">
//           <label>Scale range:</label>
//           <select
//             value={`${question.minValue || 1}-${question.maxValue || 5}`}
//             onChange={(e) => {
//               const [min, max] = e.target.value.split('-').map(Number);
//               onChange('scaleRange', index, { min, max });
//             }}
//           >
//             <option value="1-5">1 to 5</option>
//             <option value="1-7">1 to 7</option>
//             <option value="1-10">1 to 10</option>
//           </select>
//         </div>
        
//         <div className="scale-labels">
//           <div className="label-group">
//             <label>Min label:</label>
//             <input
//               type="text"
//               value={question.minLabel || ''}
//               onChange={(e) => onChange('minLabel', index, e.target.value)}
//               placeholder="Poor"
//             />
//           </div>
          
//           <div className="label-group">
//             <label>Max label:</label>
//             <input
//               type="text"
//               value={question.maxLabel || ''}
//               onChange={(e) => onChange('maxLabel', index, e.target.value)}
//               placeholder="Excellent"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ScaleQuestion;


import React, { useState } from 'react';



const ScaleQuestion = ({ question, currentAnswer, onChange }) => {

  // const [selected, setSelected] = useState(0);
  const [selected, setSelected] = useState(0); 

  if (currentAnswer) {
    setSelected(Number(currentAnswer));
  }

  console.log(question);
  
  const leftLabel = question.minLabel;
  const rightLabel = question.maxLabel;
  const n = Number(question.maxValue) - Number(question.minValue) + 1;

  console.log(leftLabel, rightLabel, n)

  // let selected = 0;
  const list = Array.from({ length: n }, (_, i) => i);

  // Handler for onClick to update selected index and apply any additional logic
   const onClickHandler = (index) => {
    setSelected(index);  // Set the selected index
    // Additional logic here (onChange, localOnChange)
    onChange(index);
    // localOnChange(index, data);
  };


  let data = list.map(index => {
    return {
      key: index+1,
      fill: selected >= index+1 ? '#0062B2' : '#ffffff',
      textcolor: selected >= index+1 ? '#ffffff' : '#4d4d4d',
    };
  });

  
  //n = 6, leftLabel = '1', rightLabel = '5',
  return (
    <div style={{ width: '50%', height: 300 }} >
    <div>
      <h2>{question.title}</h2>
    </div>
    <div style={{ display: 'flex', justifyContent: "space-between"}} className="w-full px-2 text-sm font-bold">
      <span style={{margin: 10}}>{leftLabel}</span>
      <span style={{margin: 10}}>{rightLabel}</span>
    </div>

    {/* Buttons (equally spaced and grow to fill) */}
    <div style={{ display: 'flex' }} className="flex w-full space-x-2">
   {data.map((entry, index) => (
    <button
      key={entry.key}
      onClick={() => onClickHandler(entry.key)}
      // fill={entry.fill}
      style={{ minWidth: 20, flex: 1, margin: 5, height:20, backgroundColor: entry.fill, color: entry.textcolor, borderRadius: '5px',  border: 'none'  }}
    >
      {index + 1}
    </button>
  ))}
</div>
  </div>
  );
};

// const RatingRow = ({ n = 5, leftLabel = '1', rightLabel = '5' }) => {
//   const [selected, setSelected] = useState(null);

//   return (
//     <div className="flex flex-col items-center space-y-2">
//       {/* Labels */}
//       <div className="flex justify-between w-full px-2 text-sm font-bold">
//         <span>{leftLabel}</span>
//         <span>{rightLabel}</span>
//       </div>

//       {/* Buttons */}
//       <div className="flex justify-between w-full space-x-2">
//         {[...Array(n)].map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setSelected(index)}
//             className={`w-10 h-10 border-2 rounded-full transition-colors ${
//               selected >= index ? 'bg-blue-500 border-blue-500' : 'border-blue-300'
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

export default ScaleQuestion;
