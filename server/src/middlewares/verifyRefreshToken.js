const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyRefreshToken(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    const { user } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    res.locals.user = user;
    next();
  } catch (error) {
    console.log('Invalid refresh token');
    res.status(401).clearCookie('refreshToken').json({ text: 'Invalid refresh token' });
  }
}

module.exports = verifyRefreshToken;
