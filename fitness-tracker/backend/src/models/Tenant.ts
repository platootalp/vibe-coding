import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/sequelize';

// Define the attributes for the Tenant model
interface TenantAttributes {
  id: number;
  name: string;
  subdomain: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface TenantCreationAttributes extends Optional<TenantAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define the Tenant model class
class Tenant extends Model<TenantAttributes, TenantCreationAttributes> implements TenantAttributes {
  public id!: number;
  public name!: string;
  public subdomain!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

// Initialize the Tenant model
Tenant.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subdomain: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelize, // Explicitly pass the sequelize instance
    tableName: 'tenants',
    timestamps: true,
  }
);

export default Tenant;