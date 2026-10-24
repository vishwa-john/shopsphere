const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      maxlength: [500, 'Comment cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent user from submitting multiple reviews for the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

// Static method to recalculate product average rating & rating count
reviewSchema.statics.calculateAverageRating = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  const Product = mongoose.model('Product');
  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingAvg: Math.round(stats[0].avgRating * 10) / 10,
      ratingCount: stats[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingAvg: 0,
      ratingCount: 0,
    });
  }
};

// Post-save hook to recalculate stats
reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

// Post-delete hook to recalculate stats
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.product);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
