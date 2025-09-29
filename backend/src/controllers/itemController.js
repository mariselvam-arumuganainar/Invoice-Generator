const itemService = require('../services/itemService');

const getAllItems = async (req, res) => {
  try {
    const items = await itemService.getAll();
    res.status(200).json(items);
  } catch (error) {
    console.error('--- ERROR FETCHING ITEMS ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    const newItem = await itemService.create(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('--- ERROR CREATING ITEM ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    const updatedItem = await itemService.update(req.params.id, req.body);
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('--- ERROR UPDATING ITEM ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    await itemService.remove(req.params.id);
    res.status(200).json({ message: `Item with ID ${req.params.id} deleted.` });
  } catch (error) {
    console.error('--- ERROR DELETING ITEM ---');
    console.error(error);
    res.status(400).json({ message: 'Failed to delete item.' });
  }
};

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
