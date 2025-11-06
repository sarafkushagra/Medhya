import mongoose from 'mongoose';

const phq9QuestionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true
  },
  options: [{
    label: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      enum: [0, 1, 2, 3],
      required: true
    }
  }]
});

const PHQ9Schema = new mongoose.Schema({
  questions: [phq9QuestionSchema]
});

export default mongoose.model('PHQ9', PHQ9Schema);