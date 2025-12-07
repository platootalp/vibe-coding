import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './User';

// Define the Notification attributes
interface NotificationAttributes {
  id: number;
  userId: number;
  type: string;
  title: string;
  content: string;
  payload?: object;
  isRead: boolean;
  sentAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the Notification creation attributes (id and timestamps are optional)
interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id' | 'createdAt' | 'updatedAt' | 'sentAt' | 'isRead' | 'payload'> {}

// Define the Notification model
class Notification extends Model<NotificationAttributes, NotificationCreationAttributes> implements NotificationAttributes {
  public id!: number;
  public userId!: number;
  public type!: string;
  public title!: string;
  public content!: string;
  public payload?: object;
  public isRead!: boolean;
  public sentAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
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
        model: User,
        key: 'id',
      },
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    payload: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'notifications',
    timestamps: true,
  }
);

// Define associations
Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default Notification;