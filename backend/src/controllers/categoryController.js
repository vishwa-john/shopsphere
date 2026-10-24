const Category = require('../models/Category');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category (Admin only)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image } = req.body;
    const category = await Category.create({ name, description, image });
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, createCategory };
