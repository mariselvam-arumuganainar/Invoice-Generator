const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const port = process.env.PORT || 5000;

// --- DEFINITIVE FIX: Specific CORS Configuration ---

// 1. Define the list of URLs that are allowed to make requests to your API
const allowedOrigins = [
  'http://localhost:5173',                      // Your local frontend for development
  'https://your-netlify-app-url.netlify.app'    // IMPORTANT: Replace with your actual live Netlify URL
];

// 2. Create the CORS options object
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests that have no origin (like mobile apps or Postman/Thunder Client)
    if (!origin) return callback(null, true);

    // If the incoming request's origin is in our allow list, allow it
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Otherwise, block it
      callback(new Error('Not allowed by CORS'));
    }
  }
};

// 3. Use the new options in your middleware
// This replaces the old `app.use(cors());`
app.use(cors(corsOptions));

// --- End of CORS Configuration ---


// Standard Middleware
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
  // The 0.0.0.0 is important for hosting platforms like Render
  console.log(`Server is running on port: ${port}`);
});
