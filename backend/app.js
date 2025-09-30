const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration (remains the same)
const allowedOrigins = [
  'http://localhost:5173',
  'https://sivasakthiandco.netlify.app'
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));
app.use(express.json());

// Register API Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/items', itemRoutes);

// A simple root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Invoice Generator API is online!');
});

// --- THE NEW CENTRALIZED ERROR HANDLER ---
// This middleware MUST be defined AFTER all other app.use() and routes calls.
app.use((err, req, res, next) => {
  // Log the error for debugging purposes
  console.error('--- GLOBAL ERROR HANDLER ---');
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const status = err.status || 'error';

  res.status(statusCode).json({
    status: status,
    // This sends the clear, user-friendly message from our AppError
    message: err.message || 'An unexpected error occurred on the server.'
  });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
