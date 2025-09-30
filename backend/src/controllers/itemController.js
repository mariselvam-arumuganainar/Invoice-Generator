const itemService = require('../services/itemService');

const getAllItems = async (req, res, next) => {
  try {
    const items = await itemService.getAllItems();
    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};

const createItem = async (req, res, next) => {
  try {
    const newItem = await itemService.createItem(req.body);
    res.status(201).json(newItem);
  } catch (error) {
    next(error);
  }
};

const updateItem = async (req, res, next) => {
  try {
    const updatedItem = await itemService.updateItem(req.params.id, req.body);
    res.status(200).json(updatedItem);
  } catch (error) {
    next(error);
  }
};

const deleteItem = async (req, res, next) => {
  try {
    await itemService.deleteItem(req.params.id);
    res.status(200).json({ message: `Item with ID ${req.params.id} deleted.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem,
};
