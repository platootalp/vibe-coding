import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';
import Food from './Food';
import Meal from './Meal';

// Define the attributes for the NutritionLog model
interface NutritionLogAttributes {
  id: number;
  userId: number;
  foodId: number;
  mealId: number;
  quantity: number; // how many servings
  consumedAt: Date; // when the food was consumed
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface NutritionLogCreationAttributes extends Optional<NutritionLogAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the NutritionLog model class
class NutritionLog extends Model<NutritionLogAttributes, NutritionLogCreationAttributes> implements NutritionLogAttributes {
  public id!: number;
  public userId!: number;
  public foodId!: number;
  public mealId!: number;
  public quantity!: number;
  public consumedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the NutritionLog model
NutritionLog.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    foodId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'foods',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    mealId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'meals',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    quantity: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 0.01,
      },
    },
    consumedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'nutrition_logs',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['userId'],
      },
      {
        unique: false,
        fields: ['foodId'],
      },
      {
        unique: false,
        fields: ['mealId'],
      },
      {
        unique: false,
        fields: ['consumedAt'],
      },
    ],
  }
);

// Define associations
User.hasMany(NutritionLog, {
  foreignKey: 'userId',
  as: 'nutritionLogs',
});

NutritionLog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Food.hasMany(NutritionLog, {
  foreignKey: 'foodId',
  as: 'nutritionLogs',
});

NutritionLog.belongsTo(Food, {
  foreignKey: 'foodId',
  as: 'food',
});

Meal.hasMany(NutritionLog, {
  foreignKey: 'mealId',
  as: 'nutritionLogs',
});

NutritionLog.belongsTo(Meal, {
  foreignKey: 'mealId',
  as: 'meal',
});

export default NutritionLog;