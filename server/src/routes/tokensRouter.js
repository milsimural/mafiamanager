const express = require('express');
const verifyRefreshToken = require('../middlewares/verifyRefreshToken');
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookieConfig');
const { User } = require('../../db/models');

const tokensRouter = express.Router();

// tokensRouter.get('/refresh', verifyRefreshToken, async (req, res) => {
//   const { id } = res.locals.user;
//   const user = await User.findByPk(id);

//   if (!user) {
//     return res.status(404).json({ error: 'User not found' });
//   }

//   delete user.password;

//   const { accessToken, refreshToken } = generateTokens({ user });
//   res.cookie('refreshToken', refreshToken, cookieConfig).json({ accessToken, user });
// });

tokensRouter.get('/refresh', verifyRefreshToken, async (req, res) => {
  try {
    const { id } = res.locals.user;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Получаем пользовательские данные без пароля
    const userData = user.get({ plain: true });
    delete userData.password; // Убедитесь, что пароль удалён

    const { accessToken, refreshToken } = generateTokens({ user: userData });
    res
      .cookie('refreshToken', refreshToken, cookieConfig)
      .json({ accessToken, user: userData });
  } catch (error) {
    console.error('Ошибка при обновлении токенов:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = tokensRouter;
