# Claude Template - Backend HTTP Service

A production-ready backend HTTP service template built with Express.js, TypeScript, PostgreSQL, and comprehensive testing. This template follows an action-based API design pattern and provides a solid foundation for building scalable backend services.

## Features

- **TypeScript** - Full type safety with strict mode enabled
- **Express.js** - Fast, unopinionated web framework
- **PostgreSQL + Sequelize** - Robust database with TypeScript-friendly ORM
- **Action-based API design** - Clear, explicit endpoints (e.g., `/todo/create`, `/todo/remove`)
- **Jest Testing** - Comprehensive unit and integration tests
- **Swagger Documentation** - Auto-generated API documentation
- **Development Tools** - Hot reloading, linting, formatting

## Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher) - only needed for local development without Docker
- npm (v8 or higher) - only needed for local development without Docker

## Quick Start with Docker (Recommended)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd claude-template
   ```

2. **Start the services:**
   ```bash
   # Start PostgreSQL and the app
   npm run docker:up

   # Run migrations
   npm run docker:migrate

   # Seed the database (optional)
   npm run docker:seed
   ```

3. **Access the services:**
   - API: http://localhost:3000
   - Swagger Docs: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health
   - pgAdmin: http://localhost:5050 (login: admin@example.com / admin123)

4. **View logs:**
   ```bash
   npm run docker:logs
   ```

5. **Stop services:**
   ```bash
   npm run docker:down
   ```

## Quick Start without Docker

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd claude-template
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Set up the database:**
   ```bash
   # Create your PostgreSQL database
   createdb claude_template_dev

   # Run migrations
   npm run db:migrate

   # Seed with test data (optional)
   npm run db:seed
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **View API documentation:**
   Open http://localhost:3000/api-docs in your browser

## Project Structure

```
src/
├── routes/         # Express route definitions
├── interactors/    # Business logic layer
├── serializers/    # Response formatting
├── models/         # Sequelize models
├── middleware/     # Express middleware
├── config/         # Configuration files
├── utils/          # Utility functions
├── migrations/     # Database migrations
└── seeders/        # Database seed files
```

## Available Scripts

### Development Scripts
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

### Database Scripts
```bash
npm run db:migrate   # Run pending migrations
npm run db:seed      # Seed database with test data
```

### Docker Scripts
```bash
npm run docker:up      # Start all services in Docker
npm run docker:down    # Stop all Docker services
npm run docker:logs    # View app logs
npm run docker:build   # Rebuild Docker images
npm run docker:migrate # Run migrations in Docker
npm run docker:seed    # Run seeds in Docker
```

## API Design Philosophy

This template uses **action-based endpoints** instead of traditional RESTful design:

```
POST /todo/create     # Create a new todo
POST /todo/remove     # Remove a todo
POST /todo/complete   # Mark todo as complete
GET  /todo/list       # List todos with filtering
```

This approach makes APIs more explicit and easier to understand.

## Testing

Tests are co-located with source files:
- `create-todo.interactor.ts` → `create-todo.interactor.test.ts`

Run tests:
```bash
# Local testing
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report

# Docker testing (isolated environment)
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## Database Management

```bash
# Run migrations
npm run db:migrate

# Undo last migration
npm run db:migrate:undo

# Seed database
npm run db:seed

# Undo all seeds
npm run db:seed:undo
```

## Environment Variables

See `.env.example` for all available options:

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret for JWT tokens
- `SWAGGER_ENABLED` - Enable/disable Swagger docs

**Note:** When using Docker Compose, environment variables are already configured in the `docker-compose.yml` files.

## Contributing

1. Follow the existing code style
2. Write tests for new features
3. Keep business logic in interactors
4. Use action-based endpoint naming
5. Update documentation as needed

## Docker Services

The Docker setup includes:

1. **PostgreSQL** - Database server on port 5432
2. **App** - Node.js application on port 3000
3. **pgAdmin** - Database management UI on port 5050

### Docker Compose Files

- `docker-compose.yml` - Production configuration
- `docker-compose.dev.yml` - Development with hot reloading
- `docker-compose.test.yml` - Isolated test environment

### Common Docker Commands

```bash
# View all containers
docker-compose -f docker-compose.dev.yml ps

# Execute commands in the app container
docker-compose -f docker-compose.dev.yml exec app sh

# Reset the database
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d
```

## License

ISC