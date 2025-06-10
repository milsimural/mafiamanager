// Lifetime for refresh token cookie (12 hours)
const cookieConfig = {
  httpOnly: true,
  maxAge: 12 * 60 * 60 * 1000,
  // secure: true,
  // sameSite: 'strict',
};

module.exports = cookieConfig;