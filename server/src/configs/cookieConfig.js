const jwtConfig = require("./jwtConfig");

const cookieConfig = {
  httpOnly: true,
  maxAge: jwtConfig.refresh.expiresIn,
  // Поля ниже могут пригодиться, если браузер не выписывает куки
  // secure: true,
  // sameSite: 'strict',
};

module.exports = cookieConfig;