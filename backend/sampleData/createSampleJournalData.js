import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/usermodel.js";
import JournalEntry from "./models/journalModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

const createSampleJournalData = async () => {
  try {
    // Find a student user to assign journal entries to
    const student = await User.findOne({ role: "student" });
    
    if (!student) {
      return;
    }

    // Sample journal entries for the past 30 days
    const sampleEntries = [
      {
        content: "Today was a great day! I finished my project early and had time to relax. Feeling accomplished and grateful for the support from my friends.",
        mood: "happy",
        moodScore: 9,
        tags: ["productive", "grateful", "friends"],
        wellnessScore: 85,
        sleepHours: 8,
        stressLevel: 3,
        activities: ["studying", "exercise", "socializing"],
        gratitude: ["Supportive friends", "Good health", "Academic progress"],
        goals: ["Complete project", "Exercise regularly"],
        challenges: ["Time management"],
        achievements: ["Finished project early", "Went for a run"]
      },
      {
        content: "Feeling a bit overwhelmed with upcoming exams. Need to focus on one thing at a time and not let stress get the best of me.",
        mood: "anxious",
        moodScore: 5,
        tags: ["exams", "stress", "academic"],
        wellnessScore: 60,
        sleepHours: 6,
        stressLevel: 7,
        activities: ["studying", "meditation"],
        gratitude: ["Supportive family", "Good study resources"],
        goals: ["Study effectively", "Manage stress"],
        challenges: ["Exam preparation", "Time pressure"],
        achievements: ["Completed study session"]
      },
      {
        content: "Had a wonderful conversation with my counselor today. They helped me see things from a different perspective. Feeling more hopeful about the future.",
        mood: "happy",
        moodScore: 8,
        tags: ["counseling", "hope", "growth"],
        wellnessScore: 75,
        sleepHours: 7,
        stressLevel: 4,
        activities: ["counseling", "reflection", "reading"],
        gratitude: ["Professional support", "Personal growth", "New insights"],
        goals: ["Continue therapy", "Practice new coping skills"],
        challenges: ["Implementing new strategies"],
        achievements: ["Attended counseling session", "Gained new perspective"]
      },
      {
        content: "Not feeling my best today. Everything seems to be going wrong. Trying to remind myself that this is temporary and tomorrow will be better.",
        mood: "sad",
        moodScore: 3,
        tags: ["difficult-day", "hope", "resilience"],
        wellnessScore: 45,
        sleepHours: 5,
        stressLevel: 8,
        activities: ["rest", "self-care"],
        gratitude: ["Another day", "Ability to feel emotions"],
        goals: ["Get through the day", "Be kind to myself"],
        challenges: ["Negative thoughts", "Low energy"],
        achievements: ["Acknowledged feelings", "Practiced self-compassion"]
      },
      {
        content: "Finally got a good night's sleep! Feeling refreshed and ready to tackle the day. Going to make the most of this positive energy.",
        mood: "happy",
        moodScore: 9,
        tags: ["sleep", "energy", "positive"],
        wellnessScore: 90,
        sleepHours: 9,
        stressLevel: 2,
        activities: ["exercise", "studying", "socializing"],
        gratitude: ["Good sleep", "Health", "Positive mindset"],
        goals: ["Maintain good sleep habits", "Stay productive"],
        challenges: ["Maintaining energy throughout the day"],
        achievements: ["Good night's sleep", "Early start to the day"]
      }
    ];

    // Create entries for the past 30 days with some gaps
    const entries = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const entryDate = new Date(today);
      entryDate.setDate(entryDate.getDate() - i);
      
      // Skip some days to create realistic gaps
      if (Math.random() > 0.7) continue;
      
      const sampleEntry = sampleEntries[Math.floor(Math.random() * sampleEntries.length)];
      
      entries.push({
        user: student._id,
        content: sampleEntry.content,
        mood: sampleEntry.mood,
        moodScore: sampleEntry.moodScore,
        tags: sampleEntry.tags,
        isPrivate: true,
        institutionId: student.institutionId,
        wellnessScore: sampleEntry.wellnessScore,
        sleepHours: sampleEntry.sleepHours,
        stressLevel: sampleEntry.stressLevel,
        activities: sampleEntry.activities,
        gratitude: sampleEntry.gratitude,
        goals: sampleEntry.goals,
        challenges: sampleEntry.challenges,
        achievements: sampleEntry.achievements,
        createdAt: entryDate,
        updatedAt: entryDate
      });
    }

    // Clear existing entries for this user
    await JournalEntry.deleteMany({ user: student._id });
    
    // Insert new entries
    const createdEntries = await JournalEntry.insertMany(entries);
    
  } catch (error) {
    console.error("❌ Error creating sample journal data:", error);
  }
};

const main = async () => {
  await connectDB();
  await createSampleJournalData();
  await mongoose.disconnect();
};

main();
