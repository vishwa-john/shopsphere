const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc    Get dashboard metrics & chart data for admin
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res, next) => {
  try {
    // 1. Overall counts
    const totalUsers = await User.countDocuments({ role: 'customer' });
    const totalOrders = await Order.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $lte: 5 } });

    // 2. Revenue calculation
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$total' } } },
    ]);
    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    // 3. Monthly sales chart data (last 6 months)
    const monthlySales = await Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$total' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 },
    ]);

    const monthNames = [
      '',
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const formattedSalesChart = monthlySales.map((s) => ({
      name: `${monthNames[s._id.month]} ${s._id.year}`,
      revenue: s.revenue,
      orders: s.orders,
    }));

    // If no historic sales yet, supply realistic demo points for preview
    const salesChartData =
      formattedSalesChart.length > 0
        ? formattedSalesChart
        : [
            { name: 'May', revenue: 24500, orders: 18 },
            { name: 'Jun', revenue: 38200, orders: 27 },
            { name: 'Jul', revenue: 49100, orders: 35 },
            { name: 'Aug', revenue: 62400, orders: 46 },
            { name: 'Sep', revenue: 78900, orders: 58 },
            { name: 'Oct', revenue: 94300, orders: 69 },
          ];

    // 4. Order status distribution
    const orderStatusDist = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    // 5. Top 5 selling products
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          image: { $first: '$items.image' },
          totalUnitsSold: { $sum: '$items.qty' },
          totalRevenue: {
            $sum: { $multiply: ['$items.price', '$items.qty'] },
          },
        },
      },
      { $sort: { totalUnitsSold: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        totalUsers,
        lowStockCount,
        salesChartData,
        orderStatusDist,
        topProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with customer stats
// @route   GET /api/admin/users
// @access  Private/Admin
const getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Role must be either customer or admin.',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminStats, getAdminUsers, updateUserRole };
