const clientService = require('../services/clientService');

// This is a wrapper for all async functions to catch errors and pass them to next()
const catchAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

const getAllClients = catchAsync(async (req, res, next) => {
  const clients = await clientService.getAllClients();
  res.status(200).json(clients);
});

const createClient = catchAsync(async (req, res, next) => {
  const newClient = await clientService.createClient(req.body);
  res.status(201).json(newClient);
});

const updateClient = catchAsync(async (req, res, next) => {
  const updatedClient = await clientService.updateClient(req.params.id, req.body);
  res.status(200).json(updatedClient);
});

const deleteClient = catchAsync(async (req, res, next) => {
  await clientService.deleteClient(req.params.id);
  res.status(200).json({ message: `Client with ID ${req.params.id} deleted.` });
});

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
