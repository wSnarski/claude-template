import { serializeTodo, serializeTodoList } from './todo.serializer';
import { Todo } from '../models/todo.model';
import { ListTodosResult } from '../interactors/todo';

describe('todo.serializer', () => {
  describe('serializeTodo', () => {
    it('should serialize a todo with all fields', () => {
      const dueDate = new Date('2024-12-31T12:00:00Z');
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-02T11:00:00Z');

      const todo = {
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        assignedTo: 'user@example.com',
        dueDate,
        priority: 'high' as const,
        createdAt,
        updatedAt,
      } as Todo;

      const result = serializeTodo(todo);

      expect(result).toEqual({
        id: 1,
        title: 'Test Todo',
        description: 'Test Description',
        completed: false,
        assignedTo: 'user@example.com',
        dueDate: '2024-12-31T12:00:00.000Z',
        priority: 'high',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-02T11:00:00.000Z',
      });
    });

    it('should serialize a todo with minimal fields', () => {
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-02T11:00:00Z');

      const todo = {
        id: 1,
        title: 'Test Todo',
        description: undefined,
        completed: false,
        assignedTo: undefined,
        dueDate: undefined,
        priority: 'medium' as const,
        createdAt,
        updatedAt,
      } as Todo;

      const result = serializeTodo(todo);

      expect(result).toEqual({
        id: 1,
        title: 'Test Todo',
        description: undefined,
        completed: false,
        assignedTo: undefined,
        dueDate: undefined,
        priority: 'medium',
        createdAt: '2024-01-01T10:00:00.000Z',
        updatedAt: '2024-01-02T11:00:00.000Z',
      });
    });
  });

  describe('serializeTodoList', () => {
    it('should serialize a list of todos with pagination', () => {
      const createdAt = new Date('2024-01-01T10:00:00Z');
      const updatedAt = new Date('2024-01-02T11:00:00Z');

      const todos = [
        {
          id: 1,
          title: 'Todo 1',
          completed: false,
          priority: 'high' as const,
          createdAt,
          updatedAt,
        },
        {
          id: 2,
          title: 'Todo 2',
          completed: true,
          priority: 'low' as const,
          createdAt,
          updatedAt,
        },
      ] as Todo[];

      const listResult: ListTodosResult = {
        todos,
        total: 50,
        limit: 20,
        offset: 20,
      };

      const result = serializeTodoList(listResult);

      expect(result.data).toHaveLength(2);
      expect(result.data[0].id).toBe(1);
      expect(result.data[1].id).toBe(2);
      expect(result.pagination).toEqual({
        total: 50,
        limit: 20,
        offset: 20,
        pages: 3,
        currentPage: 2,
      });
    });

    it('should calculate pagination correctly for first page', () => {
      const listResult: ListTodosResult = {
        todos: [],
        total: 100,
        limit: 10,
        offset: 0,
      };

      const result = serializeTodoList(listResult);

      expect(result.pagination).toEqual({
        total: 100,
        limit: 10,
        offset: 0,
        pages: 10,
        currentPage: 1,
      });
    });

    it('should handle empty results', () => {
      const listResult: ListTodosResult = {
        todos: [],
        total: 0,
        limit: 20,
        offset: 0,
      };

      const result = serializeTodoList(listResult);

      expect(result.data).toEqual([]);
      expect(result.pagination).toEqual({
        total: 0,
        limit: 20,
        offset: 0,
        pages: 0,
        currentPage: 1,
      });
    });
  });
});