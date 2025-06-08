import { removeTodo, RemoveTodoInput } from './remove-todo.interactor';
import { Todo } from '../../models/todo.model';

jest.mock('../../models/todo.model');

describe('removeTodo', () => {
  const mockFindByPk = Todo.findByPk as jest.MockedFunction<typeof Todo.findByPk>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should remove an existing todo', async () => {
    const input: RemoveTodoInput = { id: 1 };
    const mockDestroy = jest.fn().mockResolvedValue(undefined);
    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      destroy: mockDestroy,
    };

    mockFindByPk.mockResolvedValue(mockTodo as any);

    await removeTodo(input);

    expect(mockFindByPk).toHaveBeenCalledWith(1);
    expect(mockDestroy).toHaveBeenCalled();
  });

  it('should throw error when todo not found', async () => {
    const input: RemoveTodoInput = { id: 999 };

    mockFindByPk.mockResolvedValue(null);

    await expect(removeTodo(input)).rejects.toThrow('Todo not found');
    expect(mockFindByPk).toHaveBeenCalledWith(999);
  });
});