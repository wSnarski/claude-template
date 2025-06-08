import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDatabase, syncDatabase } from './config/database';
import { errorHandler } from './middleware/error-handler';
import { setupSwagger } from './config/swagger';
import { todoRouter } from './routes/todo.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Routes
app.use('/todo', todoRouter);

// Swagger documentation
setupSwagger(app);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
async function startServer(): Promise<void> {
  try {
    // Connect to database
    await connectDatabase();
    
    // Sync database models (only in development)
    if (process.env.NODE_ENV === 'development') {
      await syncDatabase();
    }

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();