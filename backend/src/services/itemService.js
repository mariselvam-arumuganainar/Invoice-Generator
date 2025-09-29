const db = require('../config/db');

// Renamed functions to match the controller's expected names
const getAllItems = async () => {
  const { rows } = await db.query('SELECT * FROM items ORDER BY description ASC');
  return rows;
};

const createItem = async (itemData) => {
  const { description, hsn_code, default_sqft, default_rate } = itemData;
  const sql = 'INSERT INTO items (description, hsn_code, default_sqft, default_rate) VALUES ($1, $2, $3, $4) RETURNING id';
  const { rows } = await db.query(sql, [description, hsn_code, default_sqft, default_rate]);
  return { id: rows[0].id, ...itemData };
};

const updateItem = async (id, itemData) => {
  const { description, hsn_code, default_sqft, default_rate } = itemData;
  const sql = 'UPDATE items SET description = $1, hsn_code = $2, default_sqft = $3, default_rate = $4 WHERE id = $5';
  await db.query(sql, [description, hsn_code, default_sqft, default_rate, id]);
  return { id, ...itemData };
};

const deleteItem = async (id) => {
  await db.query('DELETE FROM items WHERE id = $1', [id]);
  return { message: 'Item deleted successfully' };
};

// Updated the exports to use the new, correct names
module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
