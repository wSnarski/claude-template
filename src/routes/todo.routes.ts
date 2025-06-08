import { Router } from 'express';
import { validate } from '../middleware/validation';
import { createError } from '../middleware/error-handler';
import {
  createTodo,
  removeTodo,
  completeTodo,
  listTodos,
} from '../interactors/todo/index';
import { serializeTodo, serializeTodoList } from '../serializers/todo.serializer';

export const todoRouter = Router();

/**
 * @swagger
 * /todo/create:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 description: The title of the todo
 *               description:
 *                 type: string
 *                 description: Optional description
 *               assignedTo:
 *                 type: string
 *                 description: Email of the assignee
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 description: Due date for the todo
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 default: medium
 *     responses:
 *       201:
 *         description: Todo created successfully
 *       400:
 *         description: Validation error
 */
todoRouter.post(
  '/create',
  validate([
    { field: 'title', required: true, type: 'string', min: 1, max: 255 },
    { field: 'description', type: 'string' },
    { field: 'assignedTo', type: 'email' },
    { field: 'dueDate', type: 'date' },
    { field: 'priority', type: 'string', enum: ['low', 'medium', 'high'] },
  ]),
  async (req, res, next) => {
    try {
      const todo = await createTodo(req.body);
      res.status(201).json(serializeTodo(todo));
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /todo/remove:
 *   post:
 *     summary: Remove a todo
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 description: The ID of the todo to remove
 *     responses:
 *       200:
 *         description: Todo removed successfully
 *       404:
 *         description: Todo not found
 */
todoRouter.post(
  '/remove',
  validate([{ field: 'id', required: true, type: 'number' }]),
  async (req, res, next) => {
    try {
      await removeTodo(req.body);
      res.status(200).json({ message: 'Todo removed successfully' });
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        next(createError('Todo not found', 404));
      } else {
        next(error);
      }
    }
  }
);

/**
 * @swagger
 * /todo/complete:
 *   post:
 *     summary: Mark a todo as completed
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 description: The ID of the todo to complete
 *     responses:
 *       200:
 *         description: Todo completed successfully
 *       400:
 *         description: Todo is already completed
 *       404:
 *         description: Todo not found
 */
todoRouter.post(
  '/complete',
  validate([{ field: 'id', required: true, type: 'number' }]),
  async (req, res, next) => {
    try {
      const todo = await completeTodo(req.body);
      res.status(200).json(serializeTodo(todo));
    } catch (error: any) {
      if (error.message === 'Todo not found') {
        next(createError('Todo not found', 404));
      } else if (error.message === 'Todo is already completed') {
        next(createError('Todo is already completed', 400));
      } else {
        next(error);
      }
    }
  }
);

/**
 * @swagger
 * /todo/list:
 *   get:
 *     summary: List todos with filtering and pagination
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: completed
 *         schema:
 *           type: boolean
 *         description: Filter by completion status
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *         description: Filter by assignee email
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter by priority
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and description
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 20
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: offset
 *         schema:
 *           type: number
 *           default: 0
 *         description: Number of items to skip
 *     responses:
 *       200:
 *         description: List of todos with pagination
 */
todoRouter.get('/list', async (req, res, next) => {
  try {
    const filters = {
      completed: req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined,
      assignedTo: req.query.assignedTo as string,
      priority: req.query.priority as 'low' | 'medium' | 'high',
      search: req.query.search as string,
      limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
      offset: req.query.offset ? parseInt(req.query.offset as string) : undefined,
    };

    const result = await listTodos(filters);
    res.status(200).json(serializeTodoList(result));
  } catch (error) {
    next(error);
  }
});