const express = require('express');
const { check } = require('express-validator');
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  addAddress,
  deleteAddress,
} = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validateMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    check('name', 'Name is required').trim().notEmpty(),
    check('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    validate,
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please provide a valid email').isEmail().normalizeEmail(),
    check('password', 'Password is required').exists(),
    validate,
  ],
  login
);

router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post(
  '/addresses',
  protect,
  [
    check('street', 'Street is required').notEmpty(),
    check('city', 'City is required').notEmpty(),
    check('state', 'State is required').notEmpty(),
    check('postalCode', 'Postal code is required').notEmpty(),
    validate,
  ],
  addAddress
);
router.delete('/addresses/:addressId', protect, deleteAddress);

module.exports = router;
