const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Store file in memory buffer for fast direct upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (jpeg, jpg, png, webp) are permitted!'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter,
});

/**
 * Upload single buffer to Cloudinary or fallback to data URI in demo mode
 */
const uploadBufferToCloudinary = async (fileBuffer, folder = 'shopsphere') => {
  // If demo credentials or development mock
  if (
    !process.env.CLOUDINARY_API_KEY ||
    process.env.CLOUDINARY_API_KEY.includes('12345') ||
    process.env.CLOUDINARY_CLOUD_NAME === 'demo_cloud'
  ) {
    // Return safe data URI for local dev
    const base64 = fileBuffer.toString('base64');
    return `data:image/jpeg;base64,${base64}`;
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

module.exports = { upload, uploadBufferToCloudinary };
