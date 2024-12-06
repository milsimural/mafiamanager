const { Router } = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../../db/models');

const authRouter = Router();
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookieConfig');

authRouter.post('/registration', async (req, res) => {
  const { name, password, email, gomafiaId } = req.body;
  const hashpass = await bcrypt.hash(password, 10);

  const [newUser, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      name,
      password: hashpass,
      coins: 20000,
      gems: 10,
      ...(gomafiaId && { gomafiaId }), // Устанавливаем gomafiaId, если он передан
    },
  });

  if (!created) {
    return res.status(400).json({ text: 'Такие учетные данные уже используются' });
  }

  const user = newUser.get();
  delete user.password;
  const { refreshToken, accessToken } = generateTokens({ user });
  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieConfig)
    .json({ user, accessToken });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const targetUser = await User.findOne({ where: { email } });
  if (!targetUser) {
    return res.status(400).json({ text: 'Неверные учетные данные' });
  }
  const isValid = await bcrypt.compare(password, targetUser.password);
  if (!isValid) {
    return res.status(400).json({ text: 'Неверные учетные данные' });
  }

  const user = targetUser.get();
  delete user.password;
  const { refreshToken, accessToken } = generateTokens({ user });
  res
    .status(200)
    .cookie('refreshToken', refreshToken, cookieConfig)
    .json({ user, accessToken });
});

// authRouter.post('/update/:userId', async (req, res) => {
//   const { userId } = req.params;
//   const user = await User.findByPk(userId);
//   if (!user) {
//     return res.status(404).json({ text: 'Пользователь не найден' });
//   }
//   const { coins, gems } = user;
//   return res.status(200).json({ coins, gems})
// });

authRouter.get('/logout', (req, res) => {
  res.clearCookie('refreshToken').status(200).send('Вы успешно вышли');
});

module.exports = authRouter;
