const mongoose = require('mongoose');


/*
{
  "_id": ObjectId,
  "survey_id": ObjectId,
  "question_id": ObjectId,
  "results": {
    "Python": 23,
    "JavaScript": 17,
    "C#": 4,
    "Other": 2
  },
  "last_updated": ISODate
}
 */

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: Number, required: true, default: 0 }
}, { _id: false, strict: false });

const QuestionSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true,
        // Add ALL possible types your frontend might send
        enum: ['multiple-choice', 'open-ended', 'scale', 'word-cloud', 
            'instruction', 'mc', 'text', 'number', 'checkbox', 'rating',
            'wordcloud', 'quiz-mc']
    },
    text: { 
        type: String, 
        required:  [true, '`text` field is required.'],
    },
    questionText: { type: String },
    title: { type: String }, // Add this field
    options: [OptionSchema],
    settings: {
        type: mongoose.Schema.Types.Mixed, // Allow any settings
        default: {}
    }
}, { strict: false });

const LiveCacheSchema = new mongoose.Schema({
  surveyId: {type: mongoose.Schema.Types.ObjectId},
  questionId: {type: mongoose.Schema.Types.ObjectId},
  questions: [QuestionSchema],
  code: {
    type: String,
    required: true,
    unique: true
  },
}, { strict: false });


const LiveCache = mongoose.model('LiveCache', LiveCacheSchema);

module.exports = LiveCache;