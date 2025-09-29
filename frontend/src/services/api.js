import axios from 'axios';

// The base URL for our backend API.
// Using an environment variable is best practice for production.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Creates a new invoice.
 * @param {object} invoiceData The complete invoice object.
 * @returns {Promise} Axios promise object.
 */
const createInvoice = (invoiceData) => {
  return axios.post(`${API_URL}/invoices`, invoiceData);
};
const createClient = (clientData) => axios.post(`${API_URL}/clients`, clientData);
const createItem = (itemData) => axios.post(`${API_URL}/items`, itemData);


/**
 * Fetches all invoices from the server.
 * @returns {Promise} Axios promise object.
 */
const getInvoices = () => {
  return axios.get(`${API_URL}/invoices`);
};
const getClients = () => axios.get(`${API_URL}/clients`);
const getItems = () => axios.get(`${API_URL}/items`);
const getInvoiceById = (id) => axios.get(`${API_URL}/invoices/${id}`);


const updateClient = (id, clientData) => axios.put(`${API_URL}/clients/${id}`, clientData);
const updateItem = (id, itemData) => axios.put(`${API_URL}/items/${id}`, itemData);

const deleteClient = (id) => axios.delete(`${API_URL}/clients/${id}`);
const deleteItem = (id) => axios.delete(`${API_URL}/items/${id}`);

// We will add functions to fetch clients and items here later
// const getClients = () => axios.get(`${API_URL}/clients`);

export default {
  createInvoice,
  createClient,
  createItem,

  getInvoices,
  getClients,
  getItems,
  getInvoiceById,

  updateClient,
  updateItem,

  deleteClient,
  deleteItem,
};
