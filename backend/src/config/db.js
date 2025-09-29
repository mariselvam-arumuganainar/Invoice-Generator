const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  // This single URL from Neon contains all the connection details
  connectionString: process.env.DATABASE_URL,
  // This is required to connect securely to Neon
  ssl: {
    rejectUnauthorized: false
  }
});

// We export an object with a 'query' method to match the new way of querying
module.exports = {
  query: (text, params) => pool.query(text, params),
};
