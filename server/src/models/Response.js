const mongoose = require('mongoose');

const ResponseSchema = new mongoose.Schema({
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true
  },
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  response: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  participant: {
    nickname: {
      type: String,
      required: true
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Response', ResponseSchema);