import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';

// Define the attributes for the Workout model
interface WorkoutAttributes {
  id: number;
  userId: number;
  name: string;
  type: 'running' | 'cycling' | 'swimming' | 'walking' | 'strength' | 'yoga' | 'other';
  duration: number; // minutes
  calories: number;
  distance?: number; // km
  steps?: number;
  date: Date;
  notes?: string;
  // Enhanced fields for real-time data
  heartRate?: number; // bpm
  avgSpeed?: number; // km/h
  maxSpeed?: number; // km/h
  elevationGain?: number; // meters
  gpsTrace?: object; // GeoJSON or array of coordinates
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface WorkoutCreationAttributes extends Optional<WorkoutAttributes, 'id' | 'createdAt' | 'updatedAt' | 'distance' | 'steps' | 'notes' | 'heartRate' | 'avgSpeed' | 'maxSpeed' | 'elevationGain' | 'gpsTrace'> {}

// Define the Workout model class
class Workout extends Model<WorkoutAttributes, WorkoutCreationAttributes> implements WorkoutAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public type!: 'running' | 'cycling' | 'swimming' | 'walking' | 'strength' | 'yoga' | 'other';
  public duration!: number;
  public calories!: number;
  public distance?: number;
  public steps?: number;
  public date!: Date;
  public notes?: string;
  // Enhanced fields for real-time data
  public heartRate?: number;
  public avgSpeed?: number;
  public maxSpeed?: number;
  public elevationGain?: number;
  public gpsTrace?: object;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Workout model
Workout.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('running', 'cycling', 'swimming', 'walking', 'strength', 'yoga', 'other'),
      allowNull: false,
    },
    duration: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    calories: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    distance: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    steps: {
      type: DataTypes.MEDIUMINT.UNSIGNED,
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Enhanced fields for real-time data
    heartRate: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
      validate: {
        min: 0,
        max: 300,
      },
    },
    avgSpeed: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    maxSpeed: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    elevationGain: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: true,
      validate: {
        min: 0,
      },
    },
    gpsTrace: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'workouts',
    timestamps: true,
  }
);

// Define associations
User.hasMany(Workout, {
  foreignKey: 'userId',
  as: 'workouts',
});

Workout.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default Workout;