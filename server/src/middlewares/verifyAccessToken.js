const jwt = require('jsonwebtoken');
require('dotenv').config();

function verifyAccessToken(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];
    const { user } = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    res.locals.user = user;
    next();
  } catch (error) {
    console.log('Invalid Access token');
    res.status(403).send('Forbidden');
  }
}

module.exports = verifyAccessToken;
