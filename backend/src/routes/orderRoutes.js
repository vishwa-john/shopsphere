const express = require('express');
const {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').post(createOrder).get(admin, getAllOrders);
router.route('/my').get(getMyOrders);
router.route('/:id').get(getOrderById);
router.route('/:id/status').patch(admin, updateOrderStatus);

module.exports = router;
