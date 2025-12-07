import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';
import User from './User';

// Define the attributes for the DeviceSync model
interface DeviceSyncAttributes {
  id: number;
  userId: number;
  deviceType: string;
  deviceId: string;
  syncData: object;
  lastSyncedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface DeviceSyncCreationAttributes extends Optional<DeviceSyncAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the DeviceSync model class
class DeviceSync extends Model<DeviceSyncAttributes, DeviceSyncCreationAttributes> implements DeviceSyncAttributes {
  public id!: number;
  public userId!: number;
  public deviceType!: string;
  public deviceId!: string;
  public syncData!: object;
  public lastSyncedAt!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the DeviceSync model
DeviceSync.init(
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
    deviceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    deviceId: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    syncData: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    lastSyncedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize: sequelize, // Explicitly pass the sequelize instance
    tableName: 'device_syncs',
    timestamps: true,
  }
);

// Define associations
User.hasMany(DeviceSync, {
  foreignKey: 'userId',
  as: 'deviceSyncs',
});

DeviceSync.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

export default DeviceSync;