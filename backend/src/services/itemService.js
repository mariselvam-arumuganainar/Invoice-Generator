const db = require('../config/db');

const getAll = async () => {
  const [rows] = await db.execute('SELECT * FROM items ORDER BY description ASC');
  return rows;
};

const create = async (itemData) => {
  const { description, hsn_code, default_rate } = itemData;
  const sql = 'INSERT INTO items (description, hsn_code, default_rate) VALUES (?, ?, ?)';
  const [result] = await db.execute(sql, [description, hsn_code, default_rate]);
  return { id: result.insertId, ...itemData };
};

const update = async (id, itemData) => {
  const { description, hsn_code, default_rate } = itemData;
  const sql = 'UPDATE items SET description = ?, hsn_code = ?, default_rate = ? WHERE id = ?';
  await db.execute(sql, [description, hsn_code, default_rate, id]);
  return { id, ...itemData };
};

const remove = async (id) => {
  // NOTE: For a real production app, you might want to prevent deleting items that are currently used in invoices.
  await db.execute('DELETE FROM items WHERE id = ?', [id]);
  return { message: 'Item deleted successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
