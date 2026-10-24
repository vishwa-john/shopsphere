const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const orderRoutes = require('./routes/orderRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const seedData = require('./utils/seeder');

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Security HTTP headers
app.use(helmet());

// CORS Configuration - Supports httpOnly cookies with credentials
const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Request rate limiter (DDoS & Brute-force protection)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
app.use('/api', apiLimiter);

// Body parsers and Cookie parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ShopSphere API is healthy and operational.',
    timestamp: new Date().toISOString(),
  });
});

// Database Seed endpoint for development
app.post('/api/seed', async (req, res, next) => {
  try {
    const result = await seedData();
    res.status(200).json({
      success: true,
      message: 'ShopSphere database seeded successfully!',
      credentials: {
        admin: 'admin@shopsphere.com / Admin@123',
        customer: 'customer@shopsphere.com / Customer@123',
      },
      ...result,
    });
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(
      `[ShopSphere] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
    );
  });
}

module.exports = app;
