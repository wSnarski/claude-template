import { createTodo, CreateTodoInput } from './create-todo.interactor';
import { Todo } from '../../models/todo.model';

jest.mock('../../models/todo.model');

describe('createTodo', () => {
  const mockTodoCreate = Todo.create as jest.MockedFunction<typeof Todo.create>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a todo with valid input', async () => {
    const input: CreateTodoInput = {
      title: 'Test Todo',
      description: 'Test Description',
      assignedTo: 'test@example.com',
      priority: 'high',
    };

    const mockTodo = {
      id: 1,
      ...input,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTodoCreate.mockResolvedValue(mockTodo as Todo);

    const result = await createTodo(input);

    expect(mockTodoCreate).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: 'Test Description',
      assignedTo: 'test@example.com',
      dueDate: undefined,
      priority: 'high',
    });
    expect(result).toEqual(mockTodo);
  });

  it('should trim whitespace from string fields', async () => {
    const input: CreateTodoInput = {
      title: '  Test Todo  ',
      description: '  Test Description  ',
      assignedTo: '  test@example.com  ',
    };

    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      description: 'Test Description',
      assignedTo: 'test@example.com',
      completed: false,
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTodoCreate.mockResolvedValue(mockTodo as Todo);

    await createTodo(input);

    expect(mockTodoCreate).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: 'Test Description',
      assignedTo: 'test@example.com',
      dueDate: undefined,
      priority: 'medium',
    });
  });

  it('should use default priority when not provided', async () => {
    const input: CreateTodoInput = {
      title: 'Test Todo',
    };

    const mockTodo = {
      id: 1,
      title: 'Test Todo',
      completed: false,
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTodoCreate.mockResolvedValue(mockTodo as Todo);

    await createTodo(input);

    expect(mockTodoCreate).toHaveBeenCalledWith({
      title: 'Test Todo',
      description: undefined,
      assignedTo: undefined,
      dueDate: undefined,
      priority: 'medium',
    });
  });

  it('should throw error when title is empty', async () => {
    const input: CreateTodoInput = {
      title: '',
    };

    await expect(createTodo(input)).rejects.toThrow('Title is required');
    expect(mockTodoCreate).not.toHaveBeenCalled();
  });

  it('should throw error when title contains only whitespace', async () => {
    const input: CreateTodoInput = {
      title: '   ',
    };

    await expect(createTodo(input)).rejects.toThrow('Title is required');
    expect(mockTodoCreate).not.toHaveBeenCalled();
  });
});