import mongoose from 'mongoose';

const gameScoreSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test_name: {
    type: String,
    required: true,
    enum: ['trail-making', 'spiral', 'word-recall', 'pattern-replication', 'verbal-fluency', 'stroop', 'go-nogo', 'depression']
  },
  score: {
    type: Number,
    required: true
  },
  time_taken: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 1.0,
    min: 0,
    max: 1
  },
  date_played: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
gameScoreSchema.index({ user_id: 1, date_played: -1 });
gameScoreSchema.index({ user_id: 1, test_name: 1, date_played: -1 });

const GameScore = mongoose.model('GameScore', gameScoreSchema);

export default GameScore;