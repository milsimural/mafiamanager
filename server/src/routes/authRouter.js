const { Router } = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../../db/models');

const authRouter = Router();
const generateTokens = require('../utils/generateTokens');
const cookieConfig = require('../configs/cookieConfig');

authRouter.post('/registration', async (req, res) => {
  try {
    const { name, password, email, gomafiaId } = req.body;
    const hashpass = await bcrypt.hash(password, 10);

    if (gomafiaId) {
      const existingUser = await User.findOne({ where: { gomafiaId } });
      if (existingUser) {
        return res.status(400).json({ text: 'gomafiaId уже используется' });
      }
    }

    const [newUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        name,
        password: hashpass,
        coins: 100000,
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
  } catch (error) {
    console.error('Error during registration process:', error);
    res.status(500).json({ text: 'Произошла ошибка на сервере' });
  }
});

authRouter.post('/login', async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error during login process:', error);
    res.status(500).json({ text: 'Произошла ошибка на сервере' });
  }
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

// Всем юзерам начислить 50000 coins
authRouter.post('/addCoinsAll', async (req, res) => {
  try {
    const users = await User.findAll();

    await Promise.all(users.map(async (user) => {
      await user.increment('coins', { by: 50000 });
    }));

    res.status(200).json({ message: 'Coins added successfully' });
  } catch (error) {
    console.error('Error adding coins:', error);
    res.status(500).json({ error: 'Failed to add coins' });
  }
});

authRouter.post('/subtractCoinsAll', async (req, res) => {
  try {
    const users = await User.findAll();

    await Promise.all(users.map(async (user) => {
      await user.decrement('coins', { by: 50000 });
    }));

    res.status(200).json({ message: 'Coins subtracted successfully' });
  } catch (error) {
    console.error('Error subtracting coins:', error);
    res.status(500).json({ error: 'Failed to subtract coins' });
  }
});


module.exports = authRouter;
