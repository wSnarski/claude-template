import { listTodos, ListTodosInput } from './list-todos.interactor';
import { Todo } from '../../models/todo.model';
import { Op } from 'sequelize';

jest.mock('../../models/todo.model');

describe('listTodos', () => {
  const mockFindAndCountAll = Todo.findAndCountAll as jest.MockedFunction<typeof Todo.findAndCountAll>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should list all todos with default parameters', async () => {
    const mockTodos = [
      { id: 1, title: 'Todo 1' },
      { id: 2, title: 'Todo 2' },
    ];

    mockFindAndCountAll.mockResolvedValue({
      rows: mockTodos as any,
      count: 2,
    });

    const result = await listTodos();

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: {},
      limit: 20,
      offset: 0,
      order: [['createdAt', 'DESC']],
    });
    expect(result).toEqual({
      todos: mockTodos,
      total: 2,
      limit: 20,
      offset: 0,
    });
  });

  it('should filter by completed status', async () => {
    const input: ListTodosInput = { completed: true };
    
    mockFindAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await listTodos(input);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: { completed: true },
      limit: 20,
      offset: 0,
      order: [['createdAt', 'DESC']],
    });
  });

  it('should filter by assignedTo', async () => {
    const input: ListTodosInput = { assignedTo: 'user@example.com' };
    
    mockFindAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await listTodos(input);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: { assignedTo: 'user@example.com' },
      limit: 20,
      offset: 0,
      order: [['createdAt', 'DESC']],
    });
  });

  it('should filter by priority', async () => {
    const input: ListTodosInput = { priority: 'high' };
    
    mockFindAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await listTodos(input);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: { priority: 'high' },
      limit: 20,
      offset: 0,
      order: [['createdAt', 'DESC']],
    });
  });

  it('should search in title and description', async () => {
    const input: ListTodosInput = { search: 'test' };
    
    mockFindAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await listTodos(input);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: '%test%' } },
          { description: { [Op.iLike]: '%test%' } },
        ],
      },
      limit: 20,
      offset: 0,
      order: [['createdAt', 'DESC']],
    });
  });

  it('should apply pagination', async () => {
    const input: ListTodosInput = { limit: 10, offset: 20 };
    
    mockFindAndCountAll.mockResolvedValue({
      rows: [],
      count: 50,
    });

    const result = await listTodos(input);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: {},
      limit: 10,
      offset: 20,
      order: [['createdAt', 'DESC']],
    });
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(20);
  });

  it('should cap limit at 100', async () => {
    const input: ListTodosInput = { limit: 200 };
    
    mockFindAndCountAll.mockResolvedValue({
      rows: [],
      count: 0,
    });

    await listTodos(input);

    expect(mockFindAndCountAll).toHaveBeenCalledWith({
      where: {},
      limit: 100,
      offset: 0,
      order: [['createdAt', 'DESC']],
    });
  });
});