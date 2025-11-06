import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: "../.env" });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected for seeding assessment questions'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Define schemas inline since the models use CommonJS
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

const GAD7 = mongoose.model('GAD7', GAD7Schema);
const PHQ9 = mongoose.model('PHQ9', PHQ9Schema);

async function seedQuestions() {
  try {
    // Read GAD-7 questions
    const gad7Path = path.join(__dirname,'..', 'jsonFiles', 'gad7Questions.json');
    const gad7Data = JSON.parse(fs.readFileSync(gad7Path, 'utf8'));
    
    // Read PHQ-9 questions
    const phq9Path = path.join(__dirname,'..', 'jsonFiles', 'phq9Questions.json');
    const phq9Data = JSON.parse(fs.readFileSync(phq9Path, 'utf8'));

    // Clear existing questions
    await GAD7.deleteMany({});
    await PHQ9.deleteMany({});

    // Insert GAD-7 questions
    await GAD7.create({
      questions: gad7Data.questions
    });

    // Insert PHQ-9 questions
    await PHQ9.create({
      questions: phq9Data.questions
    });

    console.log('✅ GAD-7 questions seeded successfully');
    console.log('✅ PHQ-9 questions seeded successfully');
    console.log(`📊 GAD-7: ${gad7Data.questions.length} questions`);
    console.log(`📊 PHQ-9: ${phq9Data.questions.length} questions`);

  } catch (error) {
    console.error('❌ Error seeding questions:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedQuestions();
