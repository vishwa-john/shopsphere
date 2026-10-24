const express = require('express');
const { check } = require('express-validator');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
} = require('../controllers/productController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { upload } = require('../middlewares/uploadMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getProducts)
  .post(
    protect,
    admin,
    upload.array('images', 5),
    [
      check('name', 'Product name is required').trim().notEmpty(),
      check('price', 'Valid price is required').isFloat({ min: 0 }),
      check('category', 'Category is required').notEmpty(),
      check('stock', 'Valid stock is required').isInt({ min: 0 }),
      validate,
    ],
    createProduct
  );

router
  .route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.array('images', 5), updateProduct)
  .delete(protect, admin, deleteProduct);

router
  .route('/:id/reviews')
  .get(getProductReviews)
  .post(
    protect,
    [
      check('rating', 'Rating between 1 and 5 is required').isInt({
        min: 1,
        max: 5,
      }),
      check('comment', 'Comment is required').trim().notEmpty(),
      validate,
    ],
    createProductReview
  );

module.exports = router;
