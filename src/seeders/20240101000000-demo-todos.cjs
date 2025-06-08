'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await queryInterface.bulkInsert('todos', [
      {
        title: 'Set up development environment',
        description: 'Install Node.js, PostgreSQL, and configure the project',
        completed: true,
        assignedTo: 'developer@example.com',
        priority: 'high',
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Review project requirements',
        description: 'Go through the PRD and clarify any questions with the product team',
        completed: false,
        assignedTo: 'developer@example.com',
        dueDate: tomorrow,
        priority: 'high',
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Design database schema',
        description: 'Create ERD and define relationships between entities',
        completed: false,
        assignedTo: 'architect@example.com',
        dueDate: nextWeek,
        priority: 'medium',
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Implement user authentication',
        description: 'Add JWT-based authentication with refresh tokens',
        completed: false,
        priority: 'high',
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Write API documentation',
        description: 'Document all endpoints with request/response examples',
        completed: false,
        assignedTo: 'developer@example.com',
        priority: 'low',
        createdAt: now,
        updatedAt: now
      },
      {
        title: 'Set up CI/CD pipeline',
        description: 'Configure GitHub Actions for automated testing and deployment',
        completed: false,
        priority: 'medium',
        createdAt: now,
        updatedAt: now
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('todos', null, {});
  }
};