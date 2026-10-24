const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be a positive number'],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required'],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'A product must have at least one image',
      },
    },
    stock: {
      type: Number,
      required: [true, 'Product stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    ratingAvg: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10, // Round to 1 decimal place
    },
    ratingCount: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative'],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for discounted price
productSchema.virtual('finalPrice').get(function () {
  if (this.discount > 0) {
    return Math.round(this.price * (1 - this.discount / 100));
  }
  return this.price;
});

// Index for text search and filtering
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1, price: 1, ratingAvg: -1 });

module.exports = mongoose.model('Product', productSchema);
