// filepath: ./server/src/models/Survey.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['multiple-choice', 'open-ended', 'scale', 'word-cloud'] },
  text: { type: String, required: true },
  options: [{ text: String, value: String }],
  settings: { allowMultiple: Boolean, timer: Number }
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  questions: [QuestionSchema],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isActive: { type: Boolean, default: false },
  code: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Survey', SurveySchema);