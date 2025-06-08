import { Todo } from '../../models/todo.model';
import { Op } from 'sequelize';

export interface ListTodosInput {
  completed?: boolean;
  assignedTo?: string;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
  limit?: number;
  offset?: number;
}

export interface ListTodosResult {
  todos: Todo[];
  total: number;
  limit: number;
  offset: number;
}

export async function listTodos(input: ListTodosInput = {}): Promise<ListTodosResult> {
  const where: any = {};
  
  if (input.completed !== undefined) {
    where.completed = input.completed;
  }
  
  if (input.assignedTo) {
    where.assignedTo = input.assignedTo;
  }
  
  if (input.priority) {
    where.priority = input.priority;
  }
  
  if (input.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${input.search}%` } },
      { description: { [Op.iLike]: `%${input.search}%` } },
    ];
  }

  const limit = Math.min(input.limit || 20, 100);
  const offset = input.offset || 0;

  const { rows: todos, count: total } = await Todo.findAndCountAll({
    where,
    limit,
    offset,
    order: [['createdAt', 'DESC']],
  });

  return {
    todos,
    total,
    limit,
    offset,
  };
}