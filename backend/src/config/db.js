const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      autoIndex: true,
    });
    console.log(`[ShopSphere] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[ShopSphere] MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
