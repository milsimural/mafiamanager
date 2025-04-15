const { Router } = require('express');

const { ItemInstance, Item, GiftConfig, Tournament } = require('../../db/models');

const itemRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

// Получаем все предметы игрока
// itemRouter.get('/:userId', verifyAccessToken, async (req, res) => {
//   try {
//     const items = await ItemInstance.findAll({
//       where: {
//         userId: req.params.userId,
//       },
//     });
//     res.status(200).json(items);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: `Ошибка при получении всех предметов ${error.message}` });
//   }
// });

itemRouter.get('/:userId', verifyAccessToken, async (req, res) => {
  try {
    const items = await ItemInstance.findAll({
      where: {
        userId: req.params.userId,
      },
      include: [{
        model: Item,
        as: 'prototype',
        attributes: ['picture']
      }],
      raw: true, // Возвращает простые объекты вместо экземпляров модели
      nest: true // Вложенные объекты для включенных моделей
    });
    
    res.status(200).json(items);
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

itemRouter.post('/add-multiple/:userId', verifyAccessToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemIds } = req.body; // Ожидаем массив ID предметов

    // Валидация входных данных
    if (!userId || !itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ error: 'Необходимо передать userId и массив itemIds' });
    }

    // Подготовка данных для массового создания
    const itemsToCreate = itemIds.map(itemId => ({
      userId,
      itemId,
      isActivated: false, // или другие значения по умолчанию
      isBlocked: false,
      activationStart: null,
      expiredAt: null
    }));

    // Массовое создание экземпляров предметов
    const createdItems = await ItemInstance.bulkCreate(itemsToCreate, {
      returning: true // Возвращать созданные записи
    });

    res.status(201).json({ 
      message: 'Items added successfully',
      count: createdItems.length,
      items: createdItems.map(item => item.id) // Возвращаем IDs созданных экземпляров
    });

  } catch (error) {
    console.error('Error adding multiple items:', error);
    res.status(500).json({ 
      error: `Ошибка при добавлении предметов: ${error.message}` 
    });
  }
});

module.exports = itemRouter;
