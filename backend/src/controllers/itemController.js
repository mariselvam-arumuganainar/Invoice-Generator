const itemService = require('../services/itemService');

const getAllItems = async (req, res) => {
  try {
    // FIX: Using the correct function name
    const items = await itemService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    console.error('--- ERROR FETCHING ITEMS ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch items', error: error.message });
  }
};

const createItem = async (req, res) => {
  try {
    // FIX: Using the correct function name
    const newItem = await itemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    console.error('--- ERROR CREATING ITEM ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to create item', error: error.message });
  }
};

const updateItem = async (req, res) => {
  try {
    // FIX: Using the correct function name
    const updatedItem = await itemService.updateItem(req.params.id, req.body);
    res.status(200).json(updatedItem);
  } catch (error) {
    console.error('--- ERROR UPDATING ITEM ---');
    console.error(error);
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    // FIX: Using the correct function name
    await itemService.deleteItem(req.params.id);
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
