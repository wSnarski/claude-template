import { Todo } from '../../models/todo.model';

export interface CreateTodoInput {
  title: string;
  description?: string;
  assignedTo?: string;
  dueDate?: Date;
  priority?: 'low' | 'medium' | 'high';
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  if (!input.title || input.title.trim().length === 0) {
    throw new Error('Title is required');
  }

  const todo = await Todo.create({
    title: input.title.trim(),
    description: input.description?.trim(),
    assignedTo: input.assignedTo?.trim(),
    dueDate: input.dueDate,
    priority: input.priority || 'medium',
  });

  return todo;
}