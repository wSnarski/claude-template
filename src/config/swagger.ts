import swaggerJsdoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Claude Template API',
      version: '1.0.0',
      description: 'Backend HTTP service template with action-based endpoints',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Unique identifier',
            },
            title: {
              type: 'string',
              description: 'Todo title',
            },
            description: {
              type: 'string',
              description: 'Todo description',
              nullable: true,
            },
            completed: {
              type: 'boolean',
              description: 'Completion status',
            },
            assignedTo: {
              type: 'string',
              description: 'Email of assignee',
              nullable: true,
            },
            dueDate: {
              type: 'string',
              format: 'date-time',
              description: 'Due date',
              nullable: true,
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
              description: 'Priority level',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Error message',
                },
                statusCode: {
                  type: 'integer',
                  description: 'HTTP status code',
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Express): void {
  if (process.env.SWAGGER_ENABLED === 'true') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger documentation available at http://localhost:${process.env.PORT || 3000}/api-docs`);
  }
}