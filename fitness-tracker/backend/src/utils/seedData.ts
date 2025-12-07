import User from '../models/User';
import Tenant from '../models/Tenant';
import WorkoutType from '../models/WorkoutType';
import Food from '../models/Food';
import Meal from '../models/Meal';

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
    
    // Create default meals
    const meals = [
      { name: 'Breakfast', description: '早餐' },
      { name: 'Lunch', description: '午餐' },
      { name: 'Dinner', description: '晚餐' },
      { name: 'Snack', description: '零食' },
    ];
    
    for (const meal of meals) {
      await Meal.findOrCreate({
        where: { name: meal.name },
        defaults: meal,
      });
    }
    
    console.log('Meals created/verified');
    
    // Create sample foods
    const foods = [
      { 
        name: 'Apple', 
        calories: 52, 
        proteinG: 0.26, 
        carbsG: 13.81, 
        fatG: 0.17, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
      { 
        name: 'Banana', 
        calories: 89, 
        proteinG: 1.09, 
        carbsG: 22.84, 
        fatG: 0.33, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
      { 
        name: 'Chicken Breast', 
        calories: 165, 
        proteinG: 31, 
        carbsG: 0, 
        fatG: 3.6, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
      { 
        name: 'Brown Rice', 
        calories: 111, 
        proteinG: 2.58, 
        carbsG: 23.14, 
        fatG: 0.91, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
      { 
        name: 'Broccoli', 
        calories: 34, 
        proteinG: 2.8, 
        carbsG: 6.6, 
        fatG: 0.4, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
      { 
        name: 'Greek Yogurt', 
        calories: 59, 
        proteinG: 10, 
        carbsG: 3.6, 
        fatG: 0.4, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
      { 
        name: 'Almonds', 
        calories: 579, 
        proteinG: 21.15, 
        carbsG: 21.55, 
        fatG: 49.93, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
      { 
        name: 'Salmon', 
        calories: 208, 
        proteinG: 20.42, 
        carbsG: 0, 
        fatG: 13.42, 
        servingSize: 100, 
        servingUnit: 'g' 
      },
    ];
    
    for (const food of foods) {
      await Food.findOrCreate({
        where: { name: food.name },
        defaults: food,
      });
    }
    
    console.log('Sample foods created/verified');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};