const invoiceService = require('../services/invoiceService');

const createInvoice = async (req, res) => {
  console.log('--- CREATE INVOICE REQUEST BODY ---');
  console.log(JSON.stringify(req.body, null, 2));

  try {
    const invoiceData = req.body;
    if (!invoiceData.client_id || !invoiceData.items || invoiceData.items.length === 0) {
      return res.status(400).json({ message: 'Client and at least one item are required.' });
    }

    const newInvoiceId = await invoiceService.createInvoice(invoiceData);
    res.status(201).json({ message: 'Invoice created successfully', invoiceId: newInvoiceId });
  } catch (error) {
    console.error('--- ERROR CREATING INVOICE ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to create invoice', error: error.message });
  }
};

const getAllInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    console.error('--- ERROR FETCHING INVOICES ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch invoices', error: error.message });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    // FIX: Changed from getById() to getInvoiceById() to match the service
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.status(200).json(invoice);
  } catch (error) {
    console.error(`--- ERROR FETCHING INVOICE ID ${req.params.id} ---`);
    console.error(error);
    res.status(404).json({ message: error.message });
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
};
