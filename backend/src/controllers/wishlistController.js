const User = require('../models/User');
const Product = require('../models/Product');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'wishlist',
      select: 'name price discount images stock ratingAvg ratingCount',
    });

    res.status(200).json({
      success: true,
      wishlist: user.wishlist || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle add/remove from wishlist
// @route   POST /api/wishlist/:productId
// @access  Private
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const user = await User.findById(req.user._id);
    const index = user.wishlist.indexOf(productId);

    let isAdded = false;
    if (index > -1) {
      user.wishlist.splice(index, 1);
      isAdded = false;
    } else {
      user.wishlist.push(productId);
      isAdded = true;
    }

    await user.save();
    await user.populate({
      path: 'wishlist',
      select: 'name price discount images stock ratingAvg ratingCount',
    });

    res.status(200).json({
      success: true,
      message: isAdded ? 'Added to wishlist' : 'Removed from wishlist',
      isWishlisted: isAdded,
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from wishlist
// @route   DELETE /api/wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );
    await user.save();
    await user.populate({
      path: 'wishlist',
      select: 'name price discount images stock ratingAvg ratingCount',
    });

    res.status(200).json({
      success: true,
      message: 'Item removed from wishlist',
      wishlist: user.wishlist,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, toggleWishlist, removeFromWishlist };
