const express = require('express');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookieConfig');
const { User } = require('../../db/models');

const tokensRouter = express.Router();

tokensRouter.get('/refresh', verifyRefreshToken, async (req, res) => {
  // const { user } = res.locals;

  // Обновление коинс
  const { id } = res.locals.user;
  const user = await User.findByPk(id);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  delete user.password;

  const { accessToken, refreshToken } = generateTokens({ user });
  res.cookie('refreshToken', refreshToken, cookieConfig).json({ accessToken, user });
});

module.exports = tokensRouter;
