import mongoose from 'mongoose';
import CommunityPost from './models/communityModel.js';
import User from './models/usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

async function createSampleCommunityData() {
  try {
    await mongoose.connect(MONGO_URI);

    // Find some student users
    const students = await User.find({ role: 'student' }).limit(10);
    if (students.length === 0) {
      process.exit(1);
    }

    // Sample posts data
    const samplePosts = [
      {
        title: "Struggling with exam anxiety - any tips?",
        content: "I have my final exams coming up in 2 weeks and I'm feeling really anxious. I can't sleep properly and I keep having panic attacks when I think about the exams. Has anyone else experienced this? What helped you cope?",
        category: "anxiety",
        tags: ["exam-stress", "anxiety", "sleep-issues"],
        isAnonymous: true,
        institutionId: "iit-delhi"
      },
      {
        title: "Feeling overwhelmed with coursework",
        content: "This semester has been really tough. I'm taking 6 courses and working part-time, and I feel like I'm drowning. I don't know how to manage my time effectively. Any advice from seniors?",
        category: "academic",
        tags: ["time-management", "coursework", "stress"],
        isAnonymous: false,
        institutionId: "iit-delhi"
      },
      {
        title: "Depression and isolation during college",
        content: "I've been feeling really down lately. I don't have many friends and I spend most of my time alone in my room. I know I should reach out but I don't know how. Has anyone been through this?",
        category: "depression",
        tags: ["depression", "isolation", "friendship"],
        isAnonymous: true,
        institutionId: "iit-bombay"
      },
      {
        title: "Relationship issues affecting my studies",
        content: "My girlfriend and I are going through a rough patch and it's really affecting my concentration. I can't focus on my studies and my grades are slipping. How do you balance relationships and academics?",
        category: "relationships",
        tags: ["relationships", "academics", "balance"],
        isAnonymous: false,
        institutionId: "iit-kanpur"
      },
      {
        title: "Can't sleep properly - help needed",
        content: "I've been having trouble sleeping for the past month. I lie in bed for hours but can't fall asleep. When I do sleep, I wake up multiple times. This is affecting my daily routine. Any suggestions?",
        category: "sleep",
        tags: ["sleep-issues", "insomnia", "routine"],
        isAnonymous: true,
        institutionId: "du-north"
      },
      {
        title: "Creating a support network - let's connect",
        content: "I think it would be great if we could form study groups or support circles for students dealing with similar challenges. Anyone interested in connecting for regular check-ins and mutual support?",
        category: "general",
        tags: ["community", "support-groups", "connection"],
        isAnonymous: false,
        institutionId: "jnu"
      },
      {
        title: "Social anxiety in group projects",
        content: "I have severe social anxiety and group projects are a nightmare for me. I freeze up when I have to present or speak in front of others. How do you cope with this?",
        category: "anxiety",
        tags: ["social-anxiety", "group-projects", "presentation"],
        isAnonymous: true,
        institutionId: "bhu"
      },
      {
        title: "Career uncertainty and stress",
        content: "I'm in my final year and I'm really stressed about my career choices. I don't know what I want to do after graduation and everyone keeps asking me about my plans. Any advice?",
        category: "general",
        tags: ["career", "uncertainty", "graduation"],
        isAnonymous: false,
        institutionId: "nit-trichy"
      },
      {
        title: "Dealing with family pressure",
        content: "My parents have very high expectations and I feel like I'm constantly disappointing them. They want me to get a high-paying job but I want to pursue my passion. How do you handle family pressure?",
        category: "relationships",
        tags: ["family-pressure", "expectations", "passion"],
        isAnonymous: true,
        institutionId: "vit-vellore"
      },
      {
        title: "Finding motivation to study",
        content: "I've completely lost motivation to study. I used to be a good student but now I can't bring myself to open my books. I feel like I'm wasting my time and money. How do you find motivation?",
        category: "depression",
        tags: ["motivation", "studying", "purpose"],
        isAnonymous: false,
        institutionId: "manipal"
      },
      {
        title: "Balancing work and studies",
        content: "I'm working 20 hours a week to support myself and it's really challenging to balance with my studies. I'm always tired and behind on assignments. Any tips for managing this?",
        category: "academic",
        tags: ["work-study", "balance", "time-management"],
        isAnonymous: true,
        institutionId: "anna-univ"
      },
      {
        title: "Dealing with imposter syndrome",
        content: "I got into a prestigious program but I feel like I don't belong here. Everyone seems smarter than me and I'm constantly afraid they'll find out I'm not good enough. Anyone else feel this way?",
        category: "anxiety",
        tags: ["imposter-syndrome", "self-doubt", "confidence"],
        isAnonymous: false,
        institutionId: "iit-delhi"
      },
      {
        title: "Coping with rejection",
        content: "I got rejected from my dream internship and I'm really devastated. I worked so hard on my application and I thought I had a good chance. How do you bounce back from rejection?",
        category: "general",
        tags: ["rejection", "resilience", "internship"],
        isAnonymous: true,
        institutionId: "iit-bombay"
      },
      {
        title: "Managing stress during placement season",
        content: "Placement season is here and I'm so stressed. I've applied to 50+ companies but haven't heard back from most. The competition is intense and I'm losing hope. Any advice?",
        category: "academic",
        tags: ["placement", "stress", "competition"],
        isAnonymous: false,
        institutionId: "iit-kanpur"
      },
      {
        title: "Building healthy study habits",
        content: "I want to develop better study habits but I don't know where to start. I procrastinate a lot and end up cramming before exams. What study techniques work for you?",
        category: "general",
        tags: ["study-habits", "procrastination", "techniques"],
        isAnonymous: true,
        institutionId: "du-north"
      }
    ];

    // Sample comments data
    const sampleComments = [
      "I went through the same thing last semester. Try deep breathing exercises and meditation. It really helped me.",
      "You're not alone in this. Many students feel this way. Consider talking to a counselor.",
      "I found that breaking down my study sessions into smaller chunks helped a lot.",
      "Have you tried the Pomodoro technique? It's great for maintaining focus.",
      "Remember to take breaks and be kind to yourself. You're doing your best.",
      "I recommend joining a study group. It helps with accountability and motivation.",
      "Try to establish a consistent sleep schedule. It makes a huge difference.",
      "Don't be afraid to ask for help from professors or classmates.",
      "You've got this! One step at a time.",
      "Consider using apps like Forest or Focus@Will to improve concentration."
    ];

    // Create posts with comments
    const posts = [];
    for (let i = 0; i < samplePosts.length; i++) {
      const postData = samplePosts[i];
      const randomStudent = students[Math.floor(Math.random() * students.length)];
      
      // Create post
      const post = new CommunityPost({
        author: randomStudent._id,
        title: postData.title,
        content: postData.content,
        category: postData.category,
        tags: postData.tags,
        isAnonymous: postData.isAnonymous,
        institutionId: postData.institutionId,
        views: Math.floor(Math.random() * 100) + 10,
        likes: students.slice(0, Math.floor(Math.random() * 5) + 1).map(s => s._id)
      });

      // Add comments to the post
      const numComments = Math.floor(Math.random() * 6) + 1; // 1-6 comments
      for (let j = 0; j < numComments; j++) {
        const commentAuthor = students[Math.floor(Math.random() * students.length)];
        const comment = {
          author: commentAuthor._id,
          content: sampleComments[Math.floor(Math.random() * sampleComments.length)],
          isAnonymous: Math.random() > 0.7, // 30% anonymous comments
          likes: students.slice(0, Math.floor(Math.random() * 3)).map(s => s._id)
        };
        post.comments.push(comment);
      }

      posts.push(post);
    }

    // Save all posts
    await CommunityPost.insertMany(posts);

    process.exit(0);
  } catch (err) {
    console.error("Error creating sample community data ❌", err);
    process.exit(1);
  }
}

createSampleCommunityData();
