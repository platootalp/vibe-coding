import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

// Define the attributes for the Food model
interface FoodAttributes {
  id: number;
  name: string;
  brand?: string;
  calories: number; // kcal per serving
  proteinG: number; // grams of protein per serving
  carbsG: number; // grams of carbohydrates per serving
  fatG: number; // grams of fat per serving
  servingSize: number; // serving size amount
  servingUnit: string; // serving size unit (e.g., "g", "ml", "piece")
  nutrients?: object; // additional nutrient information (JSON)
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface FoodCreationAttributes extends Optional<FoodAttributes, 'id' | 'brand' | 'nutrients' | 'createdAt' | 'updatedAt'> {}

// Define the Food model class
class Food extends Model<FoodAttributes, FoodCreationAttributes> implements FoodAttributes {
  public id!: number;
  public name!: string;
  public brand?: string;
  public calories!: number;
  public proteinG!: number;
  public carbsG!: number;
  public fatG!: number;
  public servingSize!: number;
  public servingUnit!: string;
  public nutrients?: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Food model
Food.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    brand: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    calories: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    proteinG: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    carbsG: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    fatG: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
    servingSize: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false,
      validate: {
        min: 0.01,
      },
    },
    servingUnit: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    nutrients: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'foods',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['name'],
      },
      {
        unique: false,
        fields: ['brand'],
      },
    ],
  }
);

export default Food;