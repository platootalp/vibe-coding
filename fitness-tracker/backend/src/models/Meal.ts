import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

// Define the attributes for the Meal model
interface MealAttributes {
  id: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface MealCreationAttributes extends Optional<MealAttributes, 'id' | 'description' | 'createdAt' | 'updatedAt'> {}

// Define the Meal model class
class Meal extends Model<MealAttributes, MealCreationAttributes> implements MealAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Meal model
Meal.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'meals',
    timestamps: true,
  }
);

// Seed default meals
Meal.afterSync(async () => {
  const defaultMeals = [
    { name: 'Breakfast', description: '早餐' },
    { name: 'Lunch', description: '午餐' },
    { name: 'Dinner', description: '晚餐' },
    { name: 'Snack', description: '零食' },
  ];

  for (const meal of defaultMeals) {
    await Meal.findOrCreate({
      where: { name: meal.name },
      defaults: meal,
    });
  }
});

export default Meal;