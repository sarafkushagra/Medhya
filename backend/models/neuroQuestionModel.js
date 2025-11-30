import mongoose from 'mongoose';

const neuroQuestionSchema = new mongoose.Schema({
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

const NeuroQuestionSchema = new mongoose.Schema({
  questions: [neuroQuestionSchema]
});

export default mongoose.model('NeuroQuestion', NeuroQuestionSchema);