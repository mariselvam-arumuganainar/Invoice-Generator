const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const port = process.env.PORT || 5000;

// --- DEFINITIVE CORS FIX for Preflight Requests ---

const allowedOrigins = [
  'http://localhost:5173',
  'https://sivasakthiandco.netlify.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or Postman) and requests from our allow list
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  // This is crucial for preflight requests. It tells the browser which methods are allowed.
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // This tells the browser which headers it can send.
  allowedHeaders: ['Content-Type', 'Authorization'],
  // This handles a success status for the preflight OPTIONS request.
  optionsSuccessStatus: 204
};

// This must be the VERY FIRST middleware your app uses.
// It will handle the preflight 'OPTIONS' request and set the correct headers.
app.use(cors(corsOptions));

// --- End of CORS Configuration ---

// Standard Middleware (must come AFTER CORS)
app.use(express.json());

// Register API Routes
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/items', itemRoutes);

// A simple root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Invoice Generator API is online!');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
