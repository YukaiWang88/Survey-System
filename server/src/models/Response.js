const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  surveyId: { type: String, required: true },
  questionId: { type: String, required: true },
  response: { type: mongoose.Schema.Types.Mixed, required: true },
  participant: {
    nickname: String
  },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Response', ResponseSchema);