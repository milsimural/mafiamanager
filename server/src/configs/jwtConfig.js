const jwtConfig = {
  // access token expires in 5 minutes
  access: {
    expiresIn: '5m',
  },
  // refresh token expires in 12 hours
  refresh: {
    expiresIn: '8d',
  },
};

module.exports = jwtConfig;
