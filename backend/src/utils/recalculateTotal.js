const Product = require('../models/Product');

/**
 * Recalculate order items directly from database to prevent price tampering
 */
const recalculateOrderTotals = async (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  const validatedItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (!product) {
      throw new Error(`Product not found with ID: ${item.product}`);
    }

    if (product.stock < item.qty) {
      throw new Error(
        `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.qty}`
      );
    }

    const effectivePrice =
      product.discount > 0
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    const lineTotal = effectivePrice * item.qty;
    subtotal += lineTotal;

    validatedItems.push({
      product: product._id,
      name: product.name,
      price: effectivePrice, // snapshot of authoritative server price
      image: product.images[0] || '',
      qty: item.qty,
    });
  }

  // Business logic: 5% tax, free shipping above ₹999, else ₹99
  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal >= 999 ? 0 : 99;
  const total = subtotal + tax + shippingFee;

  return {
    validatedItems,
    subtotal,
    tax,
    shippingFee,
    total,
  };
};

module.exports = { recalculateOrderTotals };
