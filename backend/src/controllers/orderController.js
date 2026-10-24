const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const { recalculateOrderTotals } = require('../utils/recalculateTotal');

// @desc    Create new order with server recalculation and inventory deduction
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod = 'Razorpay',
      paymentStatus = 'completed',
      paymentId,
      razorpayOrderId,
      razorpaySignature,
    } = req.body;

    if (!shippingAddress || !shippingAddress.street || !shippingAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'Valid shipping address is required.',
      });
    }

    // EDGE CASE: Recompute entire order totals server-side
    const { validatedItems, subtotal, tax, shippingFee, total } =
      await recalculateOrderTotals(items);

    // Atomically decrement stock
    for (const item of validatedItems) {
      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.qty } },
        { $inc: { stock: -item.qty } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({
          success: false,
          message: `Stock ran out for item "${item.name}" during checkout.`,
        });
      }
    }

    // Create the order
    const order = await Order.create({
      user: req.user._id,
      items: validatedItems,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentId: paymentId || '',
      razorpayOrderId: razorpayOrderId || '',
      razorpaySignature: razorpaySignature || '',
      orderStatus: 'placed',
      subtotal,
      tax,
      shippingFee,
      total,
    });

    // Clear user's cart after successful order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get currently logged in user's orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check ownership or admin privilege
    if (
      order.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order.',
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status (Admin)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = [
      'placed',
      'packed',
      'shipped',
      'delivered',
      'cancelled',
    ];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // EDGE CASE: If cancelling order, restore product inventory
    if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.qty },
        });
      }
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'delivered') {
      order.paymentStatus = 'completed';
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order status updated to ${orderStatus}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders,
};
