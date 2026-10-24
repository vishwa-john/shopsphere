const express = require('express');
const {
  getAdminStats,
  getAdminUsers,
  updateUserRole,
} = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect, admin); // All admin routes require authentication and admin role

router.get('/stats', getAdminStats);
router.get('/users', getAdminUsers);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
