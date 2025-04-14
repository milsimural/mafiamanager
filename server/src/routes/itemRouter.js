const { Router } = require('express');

const { ItemInstance, Item, GiftConfig, Tournament } = require('../../db/models');

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

// Создаем инстанс предмета
itemRouter.post('/add/:userId', verifyAccessToken, async (req, res) => {
  try {
    await ItemInstance.create({
      userId: req.params.userId,
      ...req.body,
    });
    res.status(200).json({ message: 'Item added successfully' });
  } catch (error) {
    res.status(500).json({ error: `Ошибка при добавлении предмета ${error.message}` });
  }
});

// Отдаем все предметы по полученному массиву id предметов
itemRouter.post('/itemsList', verifyAccessToken, async (req, res) => {
  let { itemsList } = req.body;

  if (typeof itemsList === 'string') {
    try {
      itemsList = JSON.parse(itemsList);
    } catch (e) {
      return res.status(400).json({ error: "Ошибка при парсинге из строки в массив", err: e });
    }
  }

  if (!Array.isArray(itemsList)) {
    return res.status(400).json({ error: "itemsList должен быть массивом", rec: itemsList });
  }

  try {
    const items = await Item.findAll({
      where: {
        id: itemsList,
      },
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при получении предметов ${error.message}` });
  }
});

itemRouter.get('/giftInfo/:tournamentId/:place', async (req, res) => {
  const {tournamentId, place} = req.params;
  if(!tournamentId || !place ) return res.status(500).json({error: "Не пришли айди турика или место"})
  
  const gcId = await Tournament.findByPk(tournamentId);

  
  const currentGiftConfig = await GiftConfig.findByPk(gcId.giftConfigId);
  if (!currentGiftConfig) {
    return res.status(404).json({ error: "Конфигурация подарков не найдена" });
  }

  let arrayCoinsGift;
    try {
      arrayCoinsGift = JSON.parse(currentGiftConfig.coins);
    } catch (parseError) {
      return res.status(500).json({ error: "Ошибка парсинга данных о подарках", text: parseError });
    }

  const curPlaceCoins = arrayCoinsGift[place - 1];
  if (curPlaceCoins === undefined || curPlaceCoins === null) {
    return res.status(500).json({error: "Ошибка при поиске числа монет"})
  }

  res.status(200).json({coins: {curPlaceCoins}})
}); 



module.exports = itemRouter;
