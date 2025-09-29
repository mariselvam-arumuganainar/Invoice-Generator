const db = require('../config/db');

// Renamed from getAll to getAllClients
const getAllClients = async () => {
  const { rows } = await db.query('SELECT * FROM clients ORDER BY name ASC');
  return rows;
};

// Renamed from create to createClient
const createClient = async (clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'INSERT INTO clients (name, address, gstin) VALUES ($1, $2, $3) RETURNING id';
  const { rows } = await db.query(sql, [name, address, gstin]);
  return { id: rows[0].id, ...clientData };
};

// Renamed from update to updateClient
const updateClient = async (id, clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'UPDATE clients SET name = $1, address = $2, gstin = $3 WHERE id = $4';
  await db.query(sql, [name, address, gstin, id]);
  return { id, ...clientData };
};

// Renamed from remove to deleteClient
const deleteClient = async (id) => {
  const { rows } = await db.query('SELECT id FROM invoices WHERE client_id = $1', [id]);
  if (rows.length > 0) {
    throw new Error('Cannot delete client with existing invoices. Please reassign invoices first.');
  }
  await db.query('DELETE FROM clients WHERE id = $1', [id]);
  return { message: 'Client deleted successfully' };
};

// Updated the exports to use the new, correct names
module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
