import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface TodoAttributes {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  createdAt?: Date;
  updatedAt?: Date;
}

interface TodoCreationAttributes extends Optional<TodoAttributes, 'id' | 'completed' | 'priority'> {}

export class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
  declare id: number;
  declare title: string;
  declare description?: string;
  declare completed: boolean;
  declare assignedTo?: string;
  declare dueDate?: Date;
  declare priority: 'low' | 'medium' | 'high';
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Todo.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    assignedTo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high'),
      allowNull: false,
      defaultValue: 'medium',
    },
  },
  {
    sequelize,
    modelName: 'Todo',
    tableName: 'todos',
    timestamps: true,
  }
);