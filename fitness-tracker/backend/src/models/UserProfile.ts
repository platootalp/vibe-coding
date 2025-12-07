import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';

// Define the attributes for the UserProfile model
interface UserProfileAttributes {
  id: number;
  userId: number;
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  avatarUrl?: string;
  bio?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface UserProfileCreationAttributes extends Optional<UserProfileAttributes, 'id' | 'createdAt' | 'updatedAt' | 'height' | 'weight' | 'age' | 'gender' | 'avatarUrl' | 'bio'> {}

// Define the UserProfile model class
class UserProfile extends Model<UserProfileAttributes, UserProfileCreationAttributes> implements UserProfileAttributes {
  public id!: number;
  public userId!: number;
  public height?: number;
  public weight?: number;
  public age?: number;
  public gender?: 'male' | 'female' | 'other';
  public avatarUrl?: string;
  public bio?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the UserProfile model
UserProfile.init(
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
    height: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
      validate: {
        min: 50,
        max: 300,
      },
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      validate: {
        min: 20,
        max: 1000,
      },
    },
    age: {
      type: DataTypes.TINYINT.UNSIGNED,
      allowNull: true,
      validate: {
        min: 1,
        max: 120,
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_profiles',
    timestamps: true,
  }
);

// Define associations
User.hasOne(UserProfile, {
  foreignKey: 'userId',
  as: 'profile',
});

UserProfile.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default UserProfile;