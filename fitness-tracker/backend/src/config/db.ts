import dotenv from 'dotenv';
import sequelize from './sequelize';

// Import seed function
import { seedDatabase } from '../utils/seedData';

dotenv.config();

// Test database connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connected successfully.');
    
    // Import all models after sequelize instance is created to avoid circular dependencies
    const User = (await import('../models/User')).default;
    const Tenant = (await import('../models/Tenant')).default;
    const DeviceSync = (await import('../models/DeviceSync')).default;
    const UserProfile = (await import('../models/UserProfile')).default;
    const UserMetricsHistory = (await import('../models/UserMetricsHistory')).default;
    const Workout = (await import('../models/Workout')).default;
    const WorkoutType = (await import('../models/WorkoutType')).default;
    const WorkoutPlan = (await import('../models/WorkoutPlan')).default;
    
    // Sync all models - use force: true to drop and recreate tables for development
    // In production, you should use migrations instead
    await sequelize.sync({ force: true }); // Use { force: true } to drop and recreate tables
    console.log('All models were synchronized successfully.');
    
    // Seed database with default data
    await seedDatabase();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { sequelize };
export default connectDB;