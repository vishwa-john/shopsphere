const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

dotenv.config();

const categoriesData = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'High-performance gadgets, smart audio, and premium accessories.',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&q=80',
  },
  {
    name: 'Fashion & Apparel',
    slug: 'fashion',
    description: 'Modern minimalist urban wear, jackets, and everyday essentials.',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80',
  },
  {
    name: 'Watches',
    slug: 'watches',
    description: 'Crafted chronographs, smart wearables, and timeless horology.',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
  },
  {
    name: 'Footwear',
    slug: 'footwear',
    description: 'Performance running sneakers and handcrafted leather shoes.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
  },
];

const seedData = async () => {
  try {
    console.log('[ShopSphere] Purging existing database records...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Review.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    console.log('[ShopSphere] Seeding Users...');
    const adminUser = await User.create({
      name: 'System Admin',
      email: 'admin@shopsphere.com',
      password: 'Admin@123',
      role: 'admin',
      addresses: [
        {
          street: '100 Silicon Boulevard, Tech Hub',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560100',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    const customerUser = await User.create({
      name: 'Alex Turner',
      email: 'customer@shopsphere.com',
      password: 'Customer@123',
      role: 'customer',
      addresses: [
        {
          street: '42 MG Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          isDefault: true,
        },
      ],
    });

    console.log('[ShopSphere] Seeding Categories...');
    const createdCategories = await Category.insertMany(categoriesData);
    const catMap = {};
    createdCategories.forEach((cat) => {
      catMap[cat.slug] = cat._id;
    });

    console.log('[ShopSphere] Seeding Products...');
    const productsData = [
      {
        name: 'Aura Studio Wireless ANC Headphones',
        description:
          'Engineered with 40mm beryllium drivers, active noise cancellation, transparency mode, and 38-hour battery longevity.',
        price: 18999,
        discount: 15,
        category: catMap['electronics'],
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
          'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
        ],
        stock: 24,
        ratingAvg: 4.8,
        ratingCount: 14,
        isFeatured: true,
      },
      {
        name: 'Vanguard Obsidian Automatic Chronograph',
        description:
          'Swiss-inspired automatic movement with sapphire crystal face, brushed 316L stainless steel case, and waterproof Italian calfskin band.',
        price: 24999,
        discount: 10,
        category: catMap['watches'],
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
          'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80',
        ],
        stock: 12,
        ratingAvg: 4.9,
        ratingCount: 22,
        isFeatured: true,
      },
      {
        name: 'Velocity Aero-Grip Running Sneakers',
        description:
          'Ultra-lightweight responsive foam midsole with breathable mesh upper and multidirectional carbon-rubber outsole.',
        price: 8499,
        discount: 20,
        category: catMap['footwear'],
        images: [
          'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
          'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
        ],
        stock: 35,
        ratingAvg: 4.7,
        ratingCount: 19,
        isFeatured: true,
      },
      {
        name: 'Nordic Technical Minimalist Windbreaker',
        description:
          'Waterproof seam-sealed membrane with ergonomic hood, laser-cut ventilation ports, and magnetic pocket closures.',
        price: 6999,
        discount: 5,
        category: catMap['fashion'],
        images: [
          'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
          'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80',
        ],
        stock: 18,
        ratingAvg: 4.6,
        ratingCount: 9,
        isFeatured: true,
      },
      {
        name: 'SonicPulse Smart Ergonomic Earbuds',
        description:
          'True wireless stereo with hybrid ANC, low-latency gaming mode, wireless charging case, and IPX7 sweat resistance.',
        price: 5499,
        discount: 25,
        category: catMap['electronics'],
        images: [
          'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80',
        ],
        stock: 40,
        ratingAvg: 4.5,
        ratingCount: 31,
        isFeatured: false,
      },
      {
        name: 'Legacy Minimalist Classic Leather Watch',
        description:
          'Ultra-thin 7mm profile watch face with surgical grade steel case and interchangeable vegetable-tanned genuine leather strap.',
        price: 11999,
        discount: 15,
        category: catMap['watches'],
        images: [
          'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80',
        ],
        stock: 8,
        ratingAvg: 4.8,
        ratingCount: 16,
        isFeatured: false,
      },
      {
        name: 'Zenith Heavyweight Oversized Cotton Hoodie',
        description:
          '500 GSM French terry cotton with custom drop-shoulder silhouette, double-layered hood, and ribbed side gussets.',
        price: 4499,
        discount: 0,
        category: catMap['fashion'],
        images: [
          'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
        ],
        stock: 25,
        ratingAvg: 4.7,
        ratingCount: 12,
        isFeatured: false,
      },
      {
        name: 'Strata Carbon Minimalist Trail Runner',
        description:
          'Engineered for mixed terrain with rugged Vibram lug patterns, waterproof Gore-Tex barrier, and quick-lace tension system.',
        price: 12499,
        discount: 10,
        category: catMap['footwear'],
        images: [
          'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
        ],
        stock: 14,
        ratingAvg: 4.9,
        ratingCount: 8,
        isFeatured: true,
      },
    ];

    const createdProducts = await Product.insertMany(productsData);

    console.log('[ShopSphere] Seeding Reviews...');
    await Review.create({
      product: createdProducts[0]._id,
      user: customerUser._id,
      rating: 5,
      comment:
        'The soundstage on these headphones is unbelievable! Battery life easily lasts my entire work week.',
    });

    await Review.create({
      product: createdProducts[1]._id,
      user: customerUser._id,
      rating: 5,
      comment:
        'A truly stunning watch. It gets compliments everywhere I wear it. Build quality rivals luxury brands.',
    });

    console.log('[ShopSphere] Seeding Mock Orders for Analytics...');
    await Order.create({
      user: customerUser._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          image: createdProducts[0].images[0],
          price: 16149,
          qty: 1,
        },
      ],
      shippingAddress: customerUser.addresses[0],
      paymentMethod: 'Razorpay',
      paymentStatus: 'completed',
      paymentId: 'pay_test_seeded123456',
      razorpayOrderId: 'order_seeded_123',
      orderStatus: 'delivered',
      subtotal: 16149,
      tax: 807,
      shippingFee: 0,
      total: 16956,
    });

    console.log('[ShopSphere] Database seeded successfully!');
    return {
      admin: 'admin@shopsphere.com / Admin@123',
      customer: 'customer@shopsphere.com / Customer@123',
      productsCount: createdProducts.length,
    };
  } catch (error) {
    console.error('[ShopSphere Seeder Error]:', error);
    throw error;
  }
};

// If executed directly from command line
if (require.main === module) {
  mongoose
    .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/shopsphere')
    .then(async () => {
      await seedData();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedData;
