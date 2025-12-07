import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';

// Define the attributes for the UserMetricsHistory model
interface UserMetricsHistoryAttributes {
  id: number;
  userId: number;
  weight?: number; // kg
  bmi?: number; // Body Mass Index
  bodyFatPercentage?: number; // Body Fat Percentage
  bmr?: number; // Basal Metabolic Rate
  recordedDate: Date; // The date when these metrics were recorded
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface UserMetricsHistoryCreationAttributes extends Optional<UserMetricsHistoryAttributes, 'id' | 'createdAt' | 'updatedAt' | 'weight' | 'bmi' | 'bodyFatPercentage' | 'bmr'> {}

// Define the UserMetricsHistory model class
class UserMetricsHistory extends Model<UserMetricsHistoryAttributes, UserMetricsHistoryCreationAttributes> implements UserMetricsHistoryAttributes {
  public id!: number;
  public userId!: number;
  public weight?: number;
  public bmi?: number;
  public bodyFatPercentage?: number;
  public bmr?: number;
  public recordedDate!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the UserMetricsHistory model
UserMetricsHistory.init(
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
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 20,
        max: 1000,
      },
    },
    bmi: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      validate: {
        min: 10,
        max: 50,
      },
    },
    bodyFatPercentage: {
      type: DataTypes.DECIMAL(4, 2),
      allowNull: true,
      validate: {
        min: 0,
        max: 60,
      },
    },
    bmr: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 500,
        max: 10000,
      },
    },
    recordedDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'user_metrics_history',
    timestamps: true,
    indexes: [
      {
        unique: false,
        fields: ['userId', 'recordedDate'],
      },
      {
        unique: false,
        fields: ['recordedDate'],
      },
    ],
  }
);

// Define associations
User.hasMany(UserMetricsHistory, {
  foreignKey: 'userId',
  as: 'metricsHistory',
});

UserMetricsHistory.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default UserMetricsHistory;