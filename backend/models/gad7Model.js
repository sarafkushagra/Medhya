import mongoose from 'mongoose';

const gad7QuestionSchema = new mongoose.Schema({
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
      required: true
    }
  }]
});

const GAD7Schema = new mongoose.Schema({
  questions: [gad7QuestionSchema]
});

export default mongoose.model('GAD7', GAD7Schema);