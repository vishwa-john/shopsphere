const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      select: 'name price discount images stock finalPrice',
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out deleted products and verify stock availability
    let subtotal = 0;
    const sanitizedItems = [];

    for (const item of cart.items) {
      if (item.product) {
        const p = item.product;
        const effectivePrice =
          p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price;
        subtotal += effectivePrice * item.qty;
        sanitizedItems.push({
          _id: item._id,
          product: p,
          qty: item.qty,
          itemTotal: effectivePrice * item.qty,
          isOutOfStock: p.stock < item.qty,
          availableStock: p.stock,
        });
      }
    }

    res.status(200).json({
      success: true,
      cart: {
        _id: cart._id,
        items: sanitizedItems,
        subtotal,
        totalItems: sanitizedItems.reduce((acc, curr) => acc + curr.qty, 0),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, qty = 1 } = req.body;
    const quantity = parseInt(qty, 10);

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Edge case: Out-of-stock check
    if (product.stock <= 0) {
      return res.status(400).json({
        success: false,
        message: `Sorry, "${product.name}" is currently out of stock.`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].qty + quantity;
      if (newQty > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available in stock. Cannot add more.`,
        });
      }
      cart.items[existingIndex].qty = newQty;
    } else {
      if (quantity > product.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${product.stock} units available in stock.`,
        });
      }
      cart.items.push({ product: productId, qty: quantity });
    }

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { qty } = req.body;
    const requestedQty = parseInt(qty, 10);

    if (requestedQty < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1.',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not in cart' });
    }

    const product = await Product.findById(item.product);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Out of stock verification
    if (requestedQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} units available in stock.`,
      });
    }

    item.qty = requestedQty;
    await cart.save();

    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove single item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item._id.toString() !== req.params.itemId
    );

    await cart.save();
    return getCart(req, res, next);
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: { items: [], subtotal: 0, totalItems: 0 },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
