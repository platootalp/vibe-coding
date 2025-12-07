import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/db';

// Define the attributes for the User model
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  age?: number;
  height?: number;
  weight?: number;
  gender?: 'male' | 'female' | 'other';
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the creation attributes (id and timestamps are auto-generated)
interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'age' | 'height' | 'weight' | 'gender'> {}

// Define the User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public age?: number;
  public height?: number;
  public weight?: number;
  public gender?: 'male' | 'female' | 'other';
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to compare passwords
  public async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

// Initialize the User model
User.init(
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
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: [6, 100],
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
    height: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
      validate: {
        min: 50,
        max: 300,
      },
    },
    weight: {
      type: DataTypes.SMALLINT.UNSIGNED,
      allowNull: true,
      validate: {
        min: 20,
        max: 1000,
      },
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    hooks: {
      // Hash password before saving
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;