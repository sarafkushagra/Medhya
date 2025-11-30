import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/usermodel.js';
import Counselor from '../models/counselorModel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB Atlas (Cloud Database)
const connectToCloudDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI not found in environment variables');
    }
    
    
    await mongoose.connect(mongoUri);
    
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

// Check the actual cloud database where real users are stored
const checkCloudDatabase = async () => {
  try {
    

    // Connect to cloud database
    await connectToCloudDB();

    const db = mongoose.connection.db;
    
    // Get database info
    
    
    // List all collections
    
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      
    } else {
      collections.forEach((collection, index) => {
        
      });
    }

    // Check each collection for documents
    
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      
      
      if (count > 0 && collectionName.toLowerCase().includes('user')) {
        // Get sample documents for user collections
        const sampleDocs = await db.collection(collectionName).find({}).limit(5).toArray();
        
        sampleDocs.forEach((doc, index) => {
          
          
          
          
          
          
          
          
          
        });
      }
    }

    // Check for users using Mongoose models
    
    const totalUsers = await User.countDocuments();
    
    
    if (totalUsers > 0) {
      const users = await User.find({}).sort({ createdAt: -1 });
      users.forEach((user, index) => {
        
        
        
        
        
        
        
        
        
        
      });
    }

    // Check for counselors
    
    const totalCounselors = await Counselor.countDocuments();
    
    
    if (totalCounselors > 0) {
      const counselors = await Counselor.find({}).sort({ createdAt: -1 });
      counselors.forEach((counselor, index) => {
        
        
        
        
        
        
        
      });
    }

    // Check for Google OAuth users
    
    const googleUsers = await User.find({ googleId: { $exists: true, $ne: null } });
    
    if (googleUsers.length > 0) {
      
      googleUsers.forEach((user, index) => {
        
      });
    } else {
      
    }

    // Check for password users
    
    const passwordUsers = await User.find({ 
      password: { $exists: true, $ne: null },
      googleId: { $exists: false }
    });
    
    if (passwordUsers.length > 0) {
      
      passwordUsers.forEach((user, index) => {
        
      });
    } else {
      
    }

  } catch (error) {
    console.error('❌ Error checking cloud database:', error);
  } finally {
    await mongoose.connection.close();
    
    process.exit(0);
  }
};

// Run the check
checkCloudDatabase();
