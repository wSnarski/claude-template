import { Todo } from '../../models/todo.model';

export interface RemoveTodoInput {
  id: number;
}

export async function removeTodo(input: RemoveTodoInput): Promise<void> {
  const todo = await Todo.findByPk(input.id);
  
  if (!todo) {
    throw new Error('Todo not found');
  }

  await todo.destroy();
}