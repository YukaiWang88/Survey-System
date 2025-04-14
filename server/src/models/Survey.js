const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String, required: true }
});

const QuestionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['multiple-choice', 'open-ended', 'scale', 'word-cloud']
  },
  text: { type: String, required: true },
  options: [OptionSchema],
  settings: {
    allowMultiple: { type: Boolean, default: false },
    timer: { type: Number, default: 0 }
  }
});

const SurveySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: [QuestionSchema],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Auto-generate survey code when creating a new survey
SurveySchema.pre('save', function(next) {
  if (this.isNew && !this.code) {
    // Generate a random 6-character code
    this.code = Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Survey', SurveySchema);