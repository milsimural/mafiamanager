const jwtConfig = {
  access: {
    expiresIn: `${5000}`,
  },
  refresh: {
    expiresIn: `${1000 * 60 * 60 * 12}`,
  },
};

module.exports = jwtConfig;
