import { completeTodo, CompleteTodoInput } from './complete-todo.interactor';
import { Todo } from '../../models/todo.model';

jest.mock('../../models/todo.model');

describe('completeTodo', () => {
  const mockFindByPk = Todo.findByPk as jest.MockedFunction<typeof Todo.findByPk>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should complete an incomplete todo', async () => {
    const input: CompleteTodoInput = { id: 1 };
    const mockSave = jest.fn().mockResolvedValue(undefined);
    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      completed: false,
      save: mockSave,
    };

    mockFindByPk.mockResolvedValue(mockTodo as any);

    const result = await completeTodo(input);

    expect(mockFindByPk).toHaveBeenCalledWith(1);
    expect(mockTodo.completed).toBe(true);
    expect(mockSave).toHaveBeenCalled();
    expect(result).toBe(mockTodo);
  });

  it('should throw error when todo not found', async () => {
    const input: CompleteTodoInput = { id: 999 };

    mockFindByPk.mockResolvedValue(null);

    await expect(completeTodo(input)).rejects.toThrow('Todo not found');
    expect(mockFindByPk).toHaveBeenCalledWith(999);
  });

  it('should throw error when todo is already completed', async () => {
    const input: CompleteTodoInput = { id: 1 };
    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      completed: true,
    };

    mockFindByPk.mockResolvedValue(mockTodo as any);

    await expect(completeTodo(input)).rejects.toThrow('Todo is already completed');
    expect(mockFindByPk).toHaveBeenCalledWith(1);
  });
});