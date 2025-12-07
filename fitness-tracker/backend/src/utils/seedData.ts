import User from '../models/User';
import Tenant from '../models/Tenant';
import WorkoutType from '../models/WorkoutType';

export const seedDatabase = async () => {
  try {
    // Create default tenant
    const defaultTenant = await Tenant.findOrCreate({
      where: { name: 'Default Tenant' },
      defaults: { name: 'Default Tenant', subdomain: 'default' }
    });
    
    console.log('Default tenant created/verified');
    
    // Create default workout types
    const workoutTypes = [
      { name: 'Running', description: 'Running exercise', metValue: 7.0, iconUrl: '🏃' },
      { name: 'Cycling', description: 'Cycling exercise', metValue: 7.5, iconUrl: '🚴' },
      { name: 'Swimming', description: 'Swimming exercise', metValue: 6.0, iconUrl: '🏊' },
      { name: 'Walking', description: 'Walking exercise', metValue: 3.5, iconUrl: '🚶' },
      { name: 'Strength Training', description: 'Strength training exercise', metValue: 5.0, iconUrl: '💪' },
      { name: 'Yoga', description: 'Yoga exercise', metValue: 2.5, iconUrl: '🧘' },
      { name: 'HIIT', description: 'High-intensity interval training', metValue: 8.0, iconUrl: '🔥' },
    ];
    
    for (const type of workoutTypes) {
      await WorkoutType.findOrCreate({
        where: { name: type.name },
        defaults: type
      });
    }
    
    console.log('Workout types created/verified');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};