// import React from 'react';
// import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

// const MCResults = ({ question, responses, totalParticipants }) => {
//   if (!question || !responses ) return null;

//   const data = question.options.map((option, index) => {
//     const count = responses.filter(r => r.answer === option.id).length;
//     return {
//       name: option.label,
//       count,
//       fill: count === Math.max(...question.options.map(o => responses.filter(r => r.answer === o.id).length)) ? '#215BA6' : '#B5DCFF',
//       textColor: count === Math.max(...question.options.map(o => responses.filter(r => r.answer === o.id).length)) ? '#215BA6' : '#B5DCFF'
//     };
//   });

//   return (
//     <div style={{ width: '100%', height: 300 }}>
//       <ResponsiveContainer>
//         <BarChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
//           <XAxis dataKey="name" tick={{ fill: '#3F3F3F', fontWeight: 600 }} />
//           <YAxis hide />
//           <Tooltip />
//           <Bar dataKey="count" radius={[8, 8, 0, 0]}> 
//             <LabelList dataKey="count" position="top" fill="#B5DCFF" formatter={(value, entry) => value} />
//             {data.map((entry, index) => (
//               <Cell key={`cell-${index}`} fill={entry.fill} />
//             ))}
//           </Bar>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default MCResults;