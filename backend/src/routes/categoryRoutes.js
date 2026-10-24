const express = require('express');
const { getCategories, createCategory } = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(getCategories).post(protect, admin, createCategory);

module.exports = router;
