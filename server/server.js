import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import testRoutes from './routes/testRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/accounts', accountRoutes); // Handles both /api/account and /api/accounts
app.use('/api/transactions', transactionRoutes);
app.use('/api/test', testRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'SecureBank ATM Simulation API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'An unexpected internal server error occurred.',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

const server = app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🏦 SecureBank ATM Server is running on port ${PORT}`);
  console.log(`📡 API Endpoints ready at http://localhost:${PORT}/api`);
  console.log(`🧪 SET Test Suite available at http://localhost:${PORT}/api/test/run-all`);
  console.log(`===============================================`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n⚠️  Port ${PORT} is already in use by another process or previous server instance.`);
    console.error(`👉 Run: npx kill-port ${PORT} (or taskkill /F /IM node.exe) to clear it.`);
    console.error(`👉 Or run on a different port: $env:PORT=5001; npm --prefix server start\n`);
    process.exit(1);
  } else {
    console.error('Server startup error:', err);
  }
});

export default app;
