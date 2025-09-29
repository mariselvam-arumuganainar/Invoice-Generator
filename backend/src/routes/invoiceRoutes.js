const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// Defines the route for creating a new invoice
// Corresponds to: POST http://localhost:5000/api/invoices
router.post('/', invoiceController.createInvoice);

// Defines the route for getting a list of all invoices
// Corresponds to: GET http://localhost:5000/api/invoices
router.get('/', invoiceController.getAllInvoices);

// Defines the route for getting a single invoice
// Corresponds to: GET http://localhost:5000/api/invoices/1
router.get('/:id', invoiceController.getInvoiceById);

module.exports = router;
