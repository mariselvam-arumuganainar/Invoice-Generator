const clientService = require('../services/clientService');

const getAllClients = async (req, res) => {
  try {
    // FIX: Changed from clientService.getAll() to clientService.getAllClients()
    const clients = await clientService.getAllClients();
    res.status(200).json(clients);
  } catch (error) {
    console.error('--- ERROR FETCHING CLIENTS ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch clients', error: error.message });
  }
};

const createClient = async (req, res) => {
  console.log('--- CREATE CLIENT REQUEST BODY ---');
  console.log(req.body);

  try {
    // FIX: Changed from clientService.create() to clientService.createClient()
    const newClient = await clientService.createClient(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    console.error('--- ERROR CREATING CLIENT ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to create client', error: error.message });
  }
};

const updateClient = async (req, res) => {
  console.log(`--- UPDATE CLIENT (ID: ${req.params.id}) REQUEST BODY ---`);
  console.log(req.body);
  try {
    // FIX: Changed from clientService.update() to clientService.updateClient()
    const updatedClient = await clientService.updateClient(req.params.id, req.body);
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error('--- ERROR UPDATING CLIENT ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to update client', error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    // FIX: Changed from clientService.remove() to clientService.deleteClient()
    await clientService.deleteClient(req.params.id);
    res.status(200).json({ message: `Client with ID ${req.params.id} deleted.` });
  } catch (error) {
    console.error('--- ERROR DELETING CLIENT ---');
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

// The exports are already correct
module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
