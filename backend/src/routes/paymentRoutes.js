const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

module.exports = router;
