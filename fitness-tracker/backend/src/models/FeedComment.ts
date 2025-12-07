import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/db';
import User from './User';
import FeedPost from './FeedPost';

// Define the attributes for the FeedComment model
interface FeedCommentAttributes {
  id: number;
  userId: number;
  postId: number;
  content: string;
  likesCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface FeedCommentCreationAttributes extends Optional<FeedCommentAttributes, 'id' | 'createdAt' | 'updatedAt' | 'likesCount'> {}

// Define the FeedComment model class
class FeedComment extends Model<FeedCommentAttributes, FeedCommentCreationAttributes> implements FeedCommentAttributes {
  public id!: number;
  public userId!: number;
  public postId!: number;
  public content!: string;
  public likesCount!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the FeedComment model
FeedComment.init(
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
    postId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'feed_posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    likesCount: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'feed_comments',
    timestamps: true,
  }
);

// Define associations
User.hasMany(FeedComment, {
  foreignKey: 'userId',
  as: 'feedComments',
});

FeedComment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

FeedPost.hasMany(FeedComment, {
  foreignKey: 'postId',
  as: 'comments',
});

FeedComment.belongsTo(FeedPost, {
  foreignKey: 'postId',
  as: 'post',
});

export default FeedComment;