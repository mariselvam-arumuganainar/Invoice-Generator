const db = require('../config/db');

const getAll = async () => {
  const { rows } = await db.query('SELECT * FROM clients ORDER BY name ASC');
  return rows;
};

const create = async (clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'INSERT INTO clients (name, address, gstin) VALUES ($1, $2, $3) RETURNING id';
  const { rows } = await db.query(sql, [name, address, gstin]);
  return { id: rows[0].id, ...clientData };
};

const update = async (id, clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'UPDATE clients SET name = $1, address = $2, gstin = $3 WHERE id = $4';
  await db.query(sql, [name, address, gstin, id]);
  return { id, ...clientData };
};

const remove = async (id) => {
  const { rows } = await db.query('SELECT id FROM invoices WHERE client_id = $1', [id]);
  if (rows.length > 0) {
    throw new Error('Cannot delete client with existing invoices. Please reassign invoices first.');
  }
  await db.query('DELETE FROM clients WHERE id = $1', [id]);
  return { message: 'Client deleted successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
