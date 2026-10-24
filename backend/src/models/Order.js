const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true }, // Snapshot of price at purchase time
  qty: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [orderItemSchema],
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true, default: 'India' },
    },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'COD'],
      default: 'Razorpay',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentId: { type: String, default: '' },
    razorpayOrderId: { type: String, default: '' },
    razorpaySignature: { type: String, default: '' },
    orderStatus: {
      type: String,
      enum: ['placed', 'packed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
    },
    subtotal: { type: Number, required: true, min: 0 },
    tax: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    total: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Index for query optimization
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
