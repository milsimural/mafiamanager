const { Router } = require('express');

const { ItemInstance } = require('../../db/models');

const itemRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

// Получаем все предметы игрока
itemRouter.get('/:userId', verifyAccessToken, async (req, res) => {
  try {
    const items = await ItemInstance.findAll({
      where: {
        userId: req.params.userId,
      },
    });
    res.json(items);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех предметов ${error.message}` });
  }
});

// Удаляем предмет по id
itemRouter.delete('/delete/:id', verifyAccessToken, async (req, res) => {
  try {
    await ItemInstance.destroy({
      where: {
        id: req.params.id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: `Ошибка при удалении предмета ${error.message}` });
  }
});

module.exports = itemRouter;
