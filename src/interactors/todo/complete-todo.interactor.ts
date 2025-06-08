import { Todo } from '../../models/todo.model';

export interface CompleteTodoInput {
  id: number;
}

export async function completeTodo(input: CompleteTodoInput): Promise<Todo> {
  const todo = await Todo.findByPk(input.id);
  
  if (!todo) {
    throw new Error('Todo not found');
  }

  if (todo.completed) {
    throw new Error('Todo is already completed');
  }

  todo.completed = true;
  await todo.save();

  return todo;
}