const db = require('../config/db');

const getAll = async () => {
  const { rows } = await db.query('SELECT * FROM items_catalog ORDER BY description ASC');
  return rows;
};

const create = async (itemData) => {
  const { description, hsn_code, default_rate } = itemData;
  const sql = 'INSERT INTO items_catalog (description, hsn_code, default_rate) VALUES ($1, $2, $3) RETURNING id';
  const { rows } = await db.query(sql, [description, hsn_code, default_rate]);
  return { id: rows[0].id, ...itemData };
};

const update = async (id, itemData) => {
  const { description, hsn_code, default_rate } = itemData;
  const sql = 'UPDATE items_catalog SET description = $1, hsn_code = $2, default_rate = $3 WHERE id = $4';
  await db.query(sql, [description, hsn_code, default_rate, id]);
  return { id, ...itemData };
};

const remove = async (id) => {
  await db.query('DELETE FROM items_catalog WHERE id = $1', [id]);
  return { message: 'Item deleted successfully' };
};

module.exports = {
  getAll,
  create,
  update,
  remove,
};
