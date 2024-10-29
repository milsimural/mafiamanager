const { Router } = require('express');
const adminRouter = Router();
const verifyAccessToken = require('../middlewares/verifyAccessToken');
const verifyAdminAccess = require('../middlewares/verifyAdminAccess');

const { User } = require('../../db/models');

adminRouter.get('/users', verifyAccessToken, verifyAdminAccess, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'name', 'email', 'accountPower'],
    });
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех пользователей ${error.message}` });
  }
});

module.exports = adminRouter;
