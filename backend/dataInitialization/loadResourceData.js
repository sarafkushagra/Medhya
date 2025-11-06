import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config({ path: "../.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the Resource model
import Resource from '../models/resourceModel.js';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Load sample data
const loadResourceData = async () => {
  try {
    // Read the sample data file
    const sampleDataPath = path.join(__dirname, '..', 'jsonFiles', 'resources_sample.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

    // Clear existing resources
    await Resource.deleteMany({});
    console.log('Cleared existing resources');

    // Insert sample data
    const resources = await Resource.insertMany(sampleData);
    console.log(`Successfully loaded ${resources.length} resources`);

    // Log some statistics
    const stats = await Resource.aggregate([
      {
        $group: {
          _id: null,
          totalResources: { $sum: 1 },
          featuredResources: { $sum: { $cond: ['$isFeatured', 1, 0] } },
          activeResources: { $sum: { $cond: ['$isActive', 1, 0] } },
          totalViews: { $sum: '$views' },
          totalDownloads: { $sum: '$downloads' }
        }
      }
    ]);

    if (stats.length > 0) {
      const stat = stats[0];
      console.log('\nResource Statistics:');
      console.log(`Total Resources: ${stat.totalResources}`);
      console.log(`Featured Resources: ${stat.featuredResources}`);
      console.log(`Active Resources: ${stat.activeResources}`);
      console.log(`Total Views: ${stat.totalViews}`);
      console.log(`Total Downloads: ${stat.totalDownloads}`);
    }

    // Language statistics
    const languageStats = await Resource.aggregate([
      {
        $group: {
          _id: '$resourceLanguage',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nResources by Language:');
    languageStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} resources`);
    });

    // Category statistics
    const categoryStats = await Resource.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    console.log('\nResources by Category:');
    categoryStats.forEach(stat => {
      console.log(`${stat._id}: ${stat.count} resources`);
    });

    console.log('\n✅ Resource data loaded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error loading resource data:', error);
    process.exit(1);
  }
};

// Run the script
connectDB().then(() => {
  loadResourceData();
});
