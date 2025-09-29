const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM clients ORDER BY name ASC');
  return rows;
};

const create = async (clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'INSERT INTO clients (name, address, gstin) VALUES (?, ?, ?)';
  const [result] = await db.execute(sql, [name, address, gstin]);
  return { id: result.insertId, ...clientData };
};

const update = async (id, clientData) => {
  const { name, address, gstin } = clientData;
  const sql = 'UPDATE clients SET name = ?, address = ?, gstin = ? WHERE id = ?';
  await db.execute(sql, [name, address, gstin, id]);
  return { id, ...clientData };
};

const remove = async (id) => {
  // Add a check here to ensure a client with existing invoices cannot be deleted
  const [invoices] = await db.execute('SELECT id FROM invoices WHERE client_id = ?', [id]);
  if (invoices.length > 0) {
    throw new Error('Cannot delete client with existing invoices. Please reassign invoices first.');
  }
  await db.execute('DELETE FROM clients WHERE id = ?', [id]);
  return { message: 'Client deleted successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
