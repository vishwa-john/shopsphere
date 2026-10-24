const Product = require('../models/Product');
const Review = require('../models/Review');
const Category = require('../models/Category');
const { uploadBufferToCloudinary } = require('../middlewares/uploadMiddleware');

// @desc    Get all products with search, category, price range, sort, pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 12,
      featured,
    } = req.query;

    const query = {};

    // 1. Text Search (Name or Description)
    if (search && search.trim() !== '') {
      query.$or = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    // 2. Category Filter (by ObjectId or slug)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const foundCategory = await Category.findOne({ slug: category });
        if (foundCategory) {
          query.category = foundCategory._id;
        }
      }
    }

    // 3. Price Range Filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 4. Featured filter
    if (featured === 'true') {
      query.isFeatured = true;
    }

    // 5. Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { ratingAvg: -1 };
    else if (sort === 'popular') sortOption = { ratingCount: -1 };

    // 6. Pagination
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      'category',
      'name slug'
    );
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({ product: product._id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      product,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin only)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discount, category, stock, isFeatured } =
      req.body;
    let images = req.body.images;

    // Handle uploaded files via multer if provided
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadBufferToCloudinary(file.buffer)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      images = Array.isArray(images)
        ? [...images, ...uploadedUrls]
        : uploadedUrls;
    }

    if (!images || (Array.isArray(images) && images.length === 0)) {
      images = [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
      ];
    }

    const product = await Product.create({
      name,
      description,
      price: Number(price),
      discount: Number(discount) || 0,
      category,
      stock: Number(stock),
      images: Array.isArray(images) ? images : [images],
      isFeatured: isFeatured === 'true' || isFeatured === true,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin only)
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let images = req.body.images || product.images;
    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        uploadBufferToCloudinary(file.buffer)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      images = Array.isArray(images)
        ? [...images, ...uploadedUrls]
        : uploadedUrls;
    }

    const updatedData = {
      ...req.body,
      images: Array.isArray(images) ? images : [images],
    };

    product = await Product.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin only)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    await Review.deleteMany({ product: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add review for product (One review per user per product)
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user has already reviewed
    const alreadyReviewed = await Review.findOne({
      product: productId,
      user: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product.',
      });
    }

    const review = await Review.create({
      product: productId,
      user: req.user._id,
      rating: Number(rating),
      comment,
    });

    await review.populate('user', 'name');

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
};
