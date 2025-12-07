import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';
import WorkoutType from './WorkoutType';

// Define the attributes for the WorkoutPlan model
interface WorkoutPlanAttributes {
  id: number;
  userId: number;
  workoutTypeId?: number;
  name: string;
  description: string;
  goal: string;
  durationWeeks: number;
  planDetails: object; // JSON field for flexible plan structure
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface WorkoutPlanCreationAttributes extends Optional<WorkoutPlanAttributes, 'id' | 'createdAt' | 'updatedAt' | 'workoutTypeId'> {}

// Define the WorkoutPlan model class
class WorkoutPlan extends Model<WorkoutPlanAttributes, WorkoutPlanCreationAttributes> implements WorkoutPlanAttributes {
  public id!: number;
  public userId!: number;
  public workoutTypeId?: number;
  public name!: string;
  public description!: string;
  public goal!: string;
  public durationWeeks!: number;
  public planDetails!: object;
  public startDate!: Date;
  public endDate!: Date;
  public isActive!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the WorkoutPlan model
WorkoutPlan.init(
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
    workoutTypeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'workout_types',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    goal: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    durationWeeks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 52,
      },
    },
    planDetails: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'workout_plans',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['userId'],
      },
      {
        unique: false,
        fields: ['workoutTypeId'],
      },
      {
        unique: false,
        fields: ['isActive'],
      },
    ],
  }
);

// Define associations
User.hasMany(WorkoutPlan, {
  foreignKey: 'userId',
  as: 'workoutPlans',
});

WorkoutPlan.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

WorkoutType.hasMany(WorkoutPlan, {
  foreignKey: 'workoutTypeId',
  as: 'workoutPlans',
});

WorkoutPlan.belongsTo(WorkoutType, {
  foreignKey: 'workoutTypeId',
  as: 'workoutType',
});

export default WorkoutPlan;