import { Todo } from '../models/todo.model';
import { ListTodosResult } from '../interactors/todo/index';

export interface TodoResponse {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface TodoListResponse {
  data: TodoResponse[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
    currentPage: number;
  };
}

export function serializeTodo(todo: Todo): TodoResponse {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    assignedTo: todo.assignedTo,
    dueDate: todo.dueDate ? todo.dueDate.toISOString() : undefined,
    priority: todo.priority,
    createdAt: todo.createdAt ? todo.createdAt.toISOString() : new Date().toISOString(),
    updatedAt: todo.updatedAt ? todo.updatedAt.toISOString() : new Date().toISOString(),
  };
}

export function serializeTodoList(result: ListTodosResult): TodoListResponse {
  const pages = Math.ceil(result.total / result.limit);
  const currentPage = Math.floor(result.offset / result.limit) + 1;

  return {
    data: result.todos.map(serializeTodo),
    pagination: {
      total: result.total,
      limit: result.limit,
      offset: result.offset,
      pages,
      currentPage,
    },
  };
}