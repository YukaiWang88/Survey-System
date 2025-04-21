const mongoose = require('mongoose');

const SurveyResultSchema = new mongoose.Schema({
  survey_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',  // Reference to your Survey model
    required: true
  },
  question_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  results: {
    type: Map,  // Using Map type for dynamic keys
    of: Number, // With numeric values
    required: true
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  settings: {
    type: mongoose.Schema.Types.Mixed, // Allow any settings
    default: {}
  }
});

// Create a compound index for faster queries on survey_id + question_id
SurveyResultSchema.index({ survey_id: 1, question_id: 1 }, { unique: true });

const SurveyResult = mongoose.model('SurveyResult', SurveyResultSchema);

module.exports = SurveyResult;