import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import swaggerUi from 'swagger-ui-express';

// Load environment variables
dotenv.config();

// Import database
import pool from './config/database.js';

// Import swagger config
import { swaggerSpec } from './config/swagger.js';

// Import routes
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import staffRoutes from './routes/staff.js';
import appointmentRoutes from './routes/appointments.js';
import clinicRoutes from './routes/clinics.js';
import revenueRoutes from './routes/revenue.js';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Compression middleware
app.use(compression());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ==================== ROUTES ====================

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Healthcare API is running',
    timestamp: new Date().toISOString(),
  });
});

// API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Healthcare API Documentation',
}));

// API routes
const API_PREFIX = '/api/v1';

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/patients`, patientRoutes);
app.use(`${API_PREFIX}/staff`, staffRoutes);
app.use(`${API_PREFIX}/appointments`, appointmentRoutes);
app.use(`${API_PREFIX}/clinics`, clinicRoutes);
app.use(`${API_PREFIX}/revenue`, revenueRoutes);

// Welcome route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Healthcare Management System API',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: `${API_PREFIX}/auth`,
      patients: `${API_PREFIX}/patients`,
      staff: `${API_PREFIX}/staff`,
      appointments: `${API_PREFIX}/appointments`,
      clinics: `${API_PREFIX}/clinics`,
      revenue: `${API_PREFIX}/revenue`,
    },
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== START SERVER ====================

// Test database connection before starting server
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  console.log('✅ Database connected successfully');

  // Start server
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🏥  HEALTHCARE MANAGEMENT SYSTEM API                    ║
║                                                            ║
║   🚀  Server running on port ${PORT}                         ║
║   📝  API Docs: http://localhost:${PORT}/api-docs            ║
║   🔗  API Base: http://localhost:${PORT}/api/v1              ║
║   🌍  Environment: ${process.env.NODE_ENV || 'development'}                        ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM signal received: closing HTTP server');
  pool.end(() => {
    console.log('✅ Database pool closed');
    process.exit(0);
  });
});

export default app;
