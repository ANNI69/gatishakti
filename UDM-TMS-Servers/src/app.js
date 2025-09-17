const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// Import routes
const udmRoutes = require('./routes/udm');
const tmsRoutes = require('./routes/tms');

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(morgan('dev')); // HTTP request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use('/udm', udmRoutes);
app.use('/tms', tmsRoutes);

// Seed route (utility)
app.post('/seed/run', async (req, res) => {
  try {
    const seedFunction = require('./seed/seed');
    await seedFunction();
    res.json({
      status: 'success',
      message: 'Database seeded successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Seed error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to seed database',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'UDM-TMS Mock Server is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'UDM-TMS Mock Server',
    version: '1.0.0',
    endpoints: {
      udm: [
        'GET /udm/component/:rid',
        'POST /udm/receipt',
        'GET /udm/batch/:batchId'
      ],
      tms: [
        'GET /tms/asset/:assetId',
        'POST /tms/asset/:assetId/fit',
        'POST /tms/asset/:assetId/inspection',
        'GET /tms/inspections'
      ],
      utility: [
        'POST /seed/run',
        'GET /health'
      ]
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(error.status || 500).json({
    status: 'error',
    message: error.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

module.exports = app;