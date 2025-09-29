const db = require('../config/db');

const getNextInvoiceNumber = async () => {
  const { rows } = await db.query("SELECT MAX(CAST(SUBSTRING(invoice_number FROM 4) AS INTEGER)) as maxNum FROM invoices WHERE invoice_number LIKE 'INV%'");
  const nextNum = (rows[0].maxnum || 0) + 1;
  return `INV${String(nextNum).padStart(3, '0')}`;
};

// The function 'createInvoice' is already correctly named.
const createInvoice = async (invoiceData) => {
  const { client_id, hiring_start, hiring_end, sgst_pct, cgst_pct, total_amount, grand_total, items } = invoiceData;
  try {
    await db.query('BEGIN');
    const invoice_number = await getNextInvoiceNumber();
    const invoiceSql = `INSERT INTO invoices (client_id, invoice_number, hiring_start, hiring_end, sgst_pct, cgst_pct, total_amount, grand_total) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`;
    const invoiceResult = await db.query(invoiceSql, [client_id, invoice_number, hiring_start, hiring_end, sgst_pct, cgst_pct, total_amount, grand_total]);
    const newInvoiceId = invoiceResult.rows[0].id;

    for (const item of items) {
      const itemSql = `INSERT INTO invoice_items (invoice_id, item_description, hsn_code, sqft, rate, amount) VALUES ($1, $2, $3, $4, $5, $6)`;
      await db.query(itemSql, [newInvoiceId, item.item_description, item.hsn_code, item.sqft, item.rate, item.amount]);
    }
    await db.query('COMMIT');
    return newInvoiceId;
  } catch (error) {
    await db.query('ROLLBACK');
    console.error("Transaction rolled back due to error:", error);
    throw error;
  }
};

// The function 'getAllInvoices' is already correctly named.
const getAllInvoices = async () => {
  const sql = `SELECT i.id, i.invoice_number, i.grand_total, i.date_created, c.name as client_name FROM invoices i JOIN clients c ON i.client_id = c.id ORDER BY i.id DESC`;
  const { rows } = await db.query(sql);
  return rows;
};

// Renamed from getById to getInvoiceById for consistency
const getInvoiceById = async (id) => {
  const { rows: invoiceRows } = await db.query('SELECT * FROM invoices WHERE id = $1', [id]);
  if (invoiceRows.length === 0) { throw new Error('Invoice not found'); }
  const invoice = invoiceRows[0];

  const { rows: itemRows } = await db.query('SELECT * FROM invoice_items WHERE invoice_id = $1', [id]);
  invoice.items = itemRows;

  const { rows: clientRows } = await db.query('SELECT * FROM clients WHERE id = $1', [invoice.client_id]);
  invoice.client = clientRows[0];

  invoice.subtotal = parseFloat(invoice.total_amount);
  invoice.sgstAmount = (invoice.subtotal * parseFloat(invoice.sgst_pct)) / 100;
  invoice.cgstAmount = (invoice.subtotal * parseFloat(invoice.cgst_pct)) / 100;
  invoice.date = new Date(invoice.date_created).toLocaleDateString("en-CA");
  invoice.invoiceNumber = invoice.invoice_number;
  invoice.sgst = parseFloat(invoice.sgst_pct);
  invoice.cgst = parseFloat(invoice.cgst_pct);
  return invoice;
};

// Updated the exports to use the new, correct names
module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
};
