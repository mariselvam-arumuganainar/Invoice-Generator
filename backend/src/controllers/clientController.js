const clientService = require('../services/clientService');

const getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAll();
    res.status(200).json(clients);
  } catch (error) {
    // Log the full error to the console for debugging
    console.error('--- ERROR FETCHING CLIENTS ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch clients', error: error.message });
  }
};

const createClient = async (req, res) => {
  // Log the incoming data to see exactly what the server is receiving
  console.log('--- CREATE CLIENT REQUEST BODY ---');
  console.log(req.body);

  try {
    const newClient = await clientService.create(req.body);
    res.status(201).json(newClient);
  } catch (error) {
    // Log the full error to the console for debugging
    console.error('--- ERROR CREATING CLIENT ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to create client', error: error.message });
  }
};

const updateClient = async (req, res) => {
  console.log(`--- UPDATE CLIENT (ID: ${req.params.id}) REQUEST BODY ---`);
  console.log(req.body);
  try {
    const updatedClient = await clientService.update(req.params.id, req.body);
    res.status(200).json(updatedClient);
  } catch (error) {
    console.error('--- ERROR UPDATING CLIENT ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to update client', error: error.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    await clientService.remove(req.params.id);
    res.status(200).json({ message: `Client with ID ${req.params.id} deleted.` });
  } catch (error) {
    console.error('--- ERROR DELETING CLIENT ---');
    console.error(error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
};
