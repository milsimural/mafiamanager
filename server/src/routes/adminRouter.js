const { Router } = require('express');
const adminRouter = Router();
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const verifyAdminAccess = require('../middlewares/verifyAdminAccess');

const { User, Transaction } = require('../../db/models');

adminRouter.get('/users', verifyAccessToken, verifyAdminAccess, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'accountPower', 'coins', 'gems'],
    });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех пользователей ${error.message}` });
  }
});

adminRouter.post(
  '/addmoney/:id',
  verifyAccessToken,
  verifyAdminAccess,
  async (req, res) => {
    try {
      const userId = req.params.id;
      const amountNum = req.body.money;

      if (Number.isNaN(amountNum)) {
        return res
          .status(400)
          .json({ error: 'Пожалуйста, введите корректное целое число' });
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: 'Пользователь не найден' });
      }

      user.coins += amountNum;
      await user.save();

      await Transaction.create({
        userId,
        type: 'adminAddMoney',
        amount: amountNum,
      });

      res.status(200).json({ message: 'Деньги успешно добавлены' });
    } catch (error) {
      res.status(500).json({ error: `Ошибка при добавлении денег: ${error.message}` });
    }
  },
);

module.exports = adminRouter;
