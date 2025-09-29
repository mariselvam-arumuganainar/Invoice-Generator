const db = require('../config/db');

// Helper function to generate the next invoice number
const getNextInvoiceNumber = async () => {
  const [rows] = await db.execute("SELECT MAX(CAST(SUBSTRING(invoice_number, 4) AS UNSIGNED)) as maxNum FROM invoices WHERE invoice_number LIKE 'INV%'");
  const nextNum = (rows[0].maxNum || 0) + 1;
  return `INV${String(nextNum).padStart(3, '0')}`;
};

// Service to create a new invoice
const createInvoice = async (invoiceData) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    const { client_id, hiring_start, hiring_end, sgst_pct, cgst_pct, total_amount, grand_total, items } = invoiceData;
    const invoice_number = await getNextInvoiceNumber();
    const invoiceSql = `INSERT INTO invoices (client_id, invoice_number, hiring_start, hiring_end, sgst_pct, cgst_pct, total_amount, grand_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [invoiceResult] = await connection.execute(invoiceSql, [client_id, invoice_number, hiring_start, hiring_end, sgst_pct, cgst_pct, total_amount, grand_total]);
    const newInvoiceId = invoiceResult.insertId;
    const itemSql = `INSERT INTO invoice_items (invoice_id, item_description, hsn_code, sqft, rate, amount) VALUES ?`;
    const itemValues = items.map(item => [newInvoiceId, item.item_description, item.hsn_code, item.sqft, item.rate, item.amount]);
    await connection.query(itemSql, [itemValues]);
    await connection.commit();
    return newInvoiceId;
  } catch (error) {
    await connection.rollback();
    console.error("Transaction rolled back due to error:", error);
    throw error;
  } finally {
    connection.release();
  }
};

// Service to retrieve all invoices
const getAllInvoices = async () => {
  const sql = `SELECT i.id, i.invoice_number, i.grand_total, i.date_created, c.name as client_name FROM invoices i JOIN clients c ON i.client_id = c.id ORDER BY i.id DESC`;
  const [rows] = await db.execute(sql);
  return rows;
};

// CORRECTED getById function
const getById = async (id) => {
  const [invoiceRows] = await db.execute('SELECT * FROM invoices WHERE id = ?', [id]);
  if (invoiceRows.length === 0) {
    throw new Error('Invoice not found');
  }
  const invoice = invoiceRows[0];

  const [itemRows] = await db.execute('SELECT * FROM invoice_items WHERE invoice_id = ?', [id]);
  invoice.items = itemRows;

  const [clientRows] = await db.execute('SELECT * FROM clients WHERE id = ?', [invoice.client_id]);
  invoice.client = clientRows[0];

  // --- FIX APPLIED HERE ---
  invoice.subtotal = invoice.total_amount;
  invoice.sgstAmount = (invoice.subtotal * invoice.sgst_pct) / 100;
  invoice.cgstAmount = (invoice.subtotal * invoice.cgst_pct) / 100;

  invoice.date = new Date(invoice.date_created).toLocaleDateString("en-CA");
  invoice.invoiceNumber = invoice.invoice_number;
  invoice.sgst = invoice.sgst_pct;
  invoice.cgst = invoice.cgst_pct;

  // This was the duplicate declaration that caused the crash. It is now removed.
  // const db = require('../config/db'); 

  return invoice;
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getById,
};
