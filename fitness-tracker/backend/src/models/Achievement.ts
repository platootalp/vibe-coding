import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';

// Define the attributes for the Achievement model
interface AchievementAttributes {
  id: number;
  userId: number;
  name: string;
  description: string;
  iconUrl?: string;
  achievedAt: Date;
  createdAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface AchievementCreationAttributes extends Optional<AchievementAttributes, 'id' | 'createdAt' | 'iconUrl'> {}

// Define the Achievement model class
class Achievement extends Model<AchievementAttributes, AchievementCreationAttributes> implements AchievementAttributes {
  public id!: number;
  public userId!: number;
  public name!: string;
  public description!: string;
  public iconUrl?: string;
  public achievedAt!: Date;
  public readonly createdAt!: Date;
}

// Initialize the Achievement model
Achievement.init(
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    iconUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    achievedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'achievements',
    timestamps: true,
    createdAt: true,
    updatedAt: false, // Achievements don't need updatedAt
  }
);

// Define associations
User.hasMany(Achievement, {
  foreignKey: 'userId',
  as: 'achievements',
});

Achievement.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default Achievement;