const invoiceService = require('../services/invoiceService');

const createInvoice = async (req, res, next) => {
  try {
    const invoiceData = req.body;
    if (!invoiceData.client_id || !invoiceData.items || invoiceData.items.length === 0) {
      return res.status(400).json({ message: 'Client and at least one item are required.' });
    }
    const newInvoiceId = await invoiceService.createInvoice(invoiceData);
    res.status(201).json({ message: 'Invoice created successfully', invoiceId: newInvoiceId });
  } catch (error) {
    next(error);
  }
};

const getAllInvoices = async (req, res, next) => {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.status(200).json(invoices);
  } catch (error) {
    next(error);
  }
};

const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.status(200).json(invoice);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
};
