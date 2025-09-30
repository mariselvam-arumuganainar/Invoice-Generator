const db = require('../config/db');

// Custom error class for handling specific, known errors
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Mark as a trusted, operational error
    Error.captureStackTrace(this, this.constructor);
  }
}

const getAllClients = async () => {
  const { rows } = await db.query('SELECT * FROM clients ORDER BY name ASC');
  return rows;
};

const createClient = async (clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'INSERT INTO clients (name, address, gstin) VALUES ($1, $2, $3) RETURNING id';

  try {
    const { rows } = await db.query(sql, [name, address, gstin]);
    return { id: rows[0].id, ...clientData };
  } catch (error) {
    // This is the professional error handling part.
    // We check the specific error code from PostgreSQL. '23505' means "unique_violation".
    if (error.code === '23505' && error.constraint === 'clients_gstin_key') {
      // If it's a duplicate GSTIN, we throw our own custom error with a clear message and a 409 status code.
      throw new AppError('A client with this GSTIN already exists.', 409); // 409 Conflict
    }
    // For any other error, we let it bubble up to be handled as a generic server error.
    throw error;
  }
};

const updateClient = async (id, clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'UPDATE clients SET name = $1, address = $2, gstin = $3 WHERE id = $4';
  try {
    await db.query(sql, [name, address, gstin, id]);
    return { id, ...clientData };
  } catch (error) {
    if (error.code === '23505' && error.constraint === 'clients_gstin_key') {
      throw new AppError('A client with this GSTIN already exists.', 409);
    }
    throw error;
  }
};

const deleteClient = async (id) => {
  const { rows } = await db.query('SELECT id FROM invoices WHERE client_id = $1', [id]);
  if (rows.length > 0) {
    throw new AppError('Cannot delete client with existing invoices. Please reassign or delete their invoices first.', 400);
  }
  await db.query('DELETE FROM clients WHERE id = $1', [id]);
  return { message: 'Client deleted successfully' };
};

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
