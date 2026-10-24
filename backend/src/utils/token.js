const jwt = require('jsonwebtoken');

/**
 * Generate JWT and send in httpOnly cookie
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );

  const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRES_DAYS, 10) || 7;
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    message,
    token, // Also return token for non-browser clients or API testing
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      addresses: user.addresses || [],
      wishlist: user.wishlist || [],
    },
  });
};

module.exports = { sendTokenResponse };
