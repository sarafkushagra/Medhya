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
    
    console.log('🔗 Connecting to MongoDB Atlas (Cloud Database)...');
    console.log(`📍 URI: ${mongoUri.replace(/\/\/.*@/, '//***:***@')}`); // Hide credentials
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB Atlas');
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error);
    process.exit(1);
  }
};

// Check the actual cloud database where real users are stored
const checkCloudDatabase = async () => {
  try {
    console.log('🔍 Checking MongoDB Atlas (Cloud Database) for Real Users\n');

    // Connect to cloud database
    await connectToCloudDB();

    const db = mongoose.connection.db;
    
    // Get database info
    console.log('📊 Cloud Database Information:');
    console.log(`  - Database Name: ${db.databaseName}`);
    console.log(`  - Connection State: ${mongoose.connection.readyState}`);
    console.log(`  - Host: ${mongoose.connection.host}`);

    // List all collections
    console.log('\n📁 All Collections in Cloud Database:');
    const collections = await db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('❌ No collections found in cloud database!');
    } else {
      collections.forEach((collection, index) => {
        console.log(`  ${index + 1}. ${collection.name} (Type: ${collection.type})`);
      });
    }

    // Check each collection for documents
    console.log('\n📄 Collection Details:');
    for (const collection of collections) {
      const collectionName = collection.name;
      const count = await db.collection(collectionName).countDocuments();
      console.log(`\n📋 Collection: ${collectionName}`);
      console.log(`  - Document Count: ${count}`);
      
      if (count > 0 && collectionName.toLowerCase().includes('user')) {
        // Get sample documents for user collections
        const sampleDocs = await db.collection(collectionName).find({}).limit(5).toArray();
        console.log(`  - Sample Documents:`);
        sampleDocs.forEach((doc, index) => {
          console.log(`\n    Document ${index + 1}:`);
          console.log(`      - ID: ${doc._id}`);
          console.log(`      - Email: ${doc.email || 'No email'}`);
          console.log(`      - Role: ${doc.role || 'No role'}`);
          console.log(`      - First Name: ${doc.firstName || 'No first name'}`);
          console.log(`      - Last Name: ${doc.lastName || 'No last name'}`);
          console.log(`      - Has Password: ${!!doc.password}`);
          console.log(`      - Has Google ID: ${!!doc.googleId}`);
          console.log(`      - Google ID: ${doc.googleId || 'None'}`);
          console.log(`      - Is Verified: ${doc.isVerified || 'No status'}`);
          console.log(`      - Created: ${doc.createdAt || 'No date'}`);
          console.log(`      - Updated: ${doc.updatedAt || 'No date'}`);
        });
      }
    }

    // Check for users using Mongoose models
    console.log('\n👥 Users in Cloud Database (via Mongoose):');
    const totalUsers = await User.countDocuments();
    console.log(`  - Total Users: ${totalUsers}`);
    
    if (totalUsers > 0) {
      const users = await User.find({}).sort({ createdAt: -1 });
      users.forEach((user, index) => {
        console.log(`\n  👤 User ${index + 1}:`);
        console.log(`    - ID: ${user._id}`);
        console.log(`    - Email: ${user.email}`);
        console.log(`    - Role: ${user.role}`);
        console.log(`    - First Name: ${user.firstName || 'Not set'}`);
        console.log(`    - Last Name: ${user.lastName || 'Not set'}`);
        console.log(`    - Has Password: ${!!user.password}`);
        console.log(`    - Has Google ID: ${!!user.googleId}`);
        console.log(`    - Google ID: ${user.googleId || 'None'}`);
        console.log(`    - Is Verified: ${user.isVerified}`);
        console.log(`    - Is Email Verified: ${user.isEmailVerified}`);
        console.log(`    - Created: ${user.createdAt}`);
        console.log(`    - Updated: ${user.updatedAt}`);
      });
    }

    // Check for counselors
    console.log('\n👨‍⚕️ Counselors in Cloud Database:');
    const totalCounselors = await Counselor.countDocuments();
    console.log(`  - Total Counselors: ${totalCounselors}`);
    
    if (totalCounselors > 0) {
      const counselors = await Counselor.find({}).sort({ createdAt: -1 });
      counselors.forEach((counselor, index) => {
        console.log(`\n  👨‍⚕️ Counselor ${index + 1}:`);
        console.log(`    - ID: ${counselor._id}`);
        console.log(`    - Name: ${counselor.name}`);
        console.log(`    - Email: ${counselor.email}`);
        console.log(`    - Specialization: ${counselor.specialization?.join(', ') || 'Not set'}`);
        console.log(`    - Is Active: ${counselor.isActive}`);
        console.log(`    - User Account: ${counselor.userAccount}`);
        console.log(`    - Created: ${counselor.createdAt}`);
        console.log(`    - Updated: ${counselor.updatedAt}`);
      });
    }

    // Check for Google OAuth users
    console.log('\n🔍 Google OAuth Users in Cloud Database:');
    const googleUsers = await User.find({ googleId: { $exists: true, $ne: null } });
    
    if (googleUsers.length > 0) {
      console.log(`Found ${googleUsers.length} Google OAuth user(s):`);
      googleUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (Google ID: ${user.googleId})`);
      });
    } else {
      console.log('❌ No Google OAuth users found in cloud database');
    }

    // Check for password users
    console.log('\n🔍 Password Users in Cloud Database:');
    const passwordUsers = await User.find({ 
      password: { $exists: true, $ne: null },
      googleId: { $exists: false }
    });
    
    if (passwordUsers.length > 0) {
      console.log(`Found ${passwordUsers.length} password user(s):`);
      passwordUsers.forEach((user, index) => {
        console.log(`  ${index + 1}. ${user.email} (Role: ${user.role})`);
      });
    } else {
      console.log('❌ No password users found in cloud database');
    }

  } catch (error) {
    console.error('❌ Error checking cloud database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Cloud database connection closed');
    process.exit(0);
  }
};

// Run the check
checkCloudDatabase();
