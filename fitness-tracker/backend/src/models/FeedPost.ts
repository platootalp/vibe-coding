import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';

// Define the attributes for the FeedPost model
interface FeedPostAttributes {
  id: number;
  userId: number;
  content: string;
  mediaUrls?: string[]; // JSON array of media URLs
  likesCount: number;
  commentsCount: number;
  isPublic: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface FeedPostCreationAttributes extends Optional<FeedPostAttributes, 'id' | 'createdAt' | 'updatedAt' | 'mediaUrls' | 'likesCount' | 'commentsCount' | 'isPublic'> {}

// Define the FeedPost model class
class FeedPost extends Model<FeedPostAttributes, FeedPostCreationAttributes> implements FeedPostAttributes {
  public id!: number;
  public userId!: number;
  public content!: string;
  public mediaUrls?: string[];
  public likesCount!: number;
  public commentsCount!: number;
  public isPublic!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the FeedPost model
FeedPost.init(
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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    mediaUrls: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    likesCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    commentsCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    isPublic: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'feed_posts',
    timestamps: true,
  }
);

// Define associations
User.hasMany(FeedPost, {
  foreignKey: 'userId',
  as: 'feedPosts',
});

FeedPost.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default FeedPost;