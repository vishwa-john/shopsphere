const express = require('express');
const {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.route('/').get(getWishlist);
router.route('/:productId').post(toggleWishlist).delete(removeFromWishlist);

module.exports = router;
