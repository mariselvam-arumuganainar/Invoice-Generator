const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import the newly created routes
const invoiceRoutes = require('./src/routes/invoiceRoutes');
const clientRoutes = require('./src/routes/clientRoutes');
const itemRoutes = require('./src/routes/itemRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Register API Routes ---
// This tells the app to use your invoice routes for any request to /api/invoices
app.use('/api/invoices', invoiceRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/items', itemRoutes);

// A simple root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Invoice Generator API is online!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
