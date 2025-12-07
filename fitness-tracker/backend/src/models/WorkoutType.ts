import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';

// Define the attributes for the WorkoutType model
interface WorkoutTypeAttributes {
  id: number;
  name: string;
  description: string;
  iconUrl?: string;
  metValue: number; // MET (Metabolic Equivalent of Task) value
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface WorkoutTypeCreationAttributes extends Optional<WorkoutTypeAttributes, 'id' | 'createdAt' | 'updatedAt' | 'iconUrl'> {}

// Define the WorkoutType model class
class WorkoutType extends Model<WorkoutTypeAttributes, WorkoutTypeCreationAttributes> implements WorkoutTypeAttributes {
  public id!: number;
  public name!: string;
  public description!: string;
  public iconUrl?: string;
  public metValue!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the WorkoutType model
WorkoutType.init(
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
    iconUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    metValue: {
      type: DataTypes.DECIMAL(3, 2),
      allowNull: false,
      defaultValue: 1.0,
      validate: {
        min: 0.1,
        max: 20.0,
      },
    },
  },
  {
    sequelize,
    tableName: 'workout_types',
    timestamps: true,
  }
);

export default WorkoutType;