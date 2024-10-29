const { Router } = require('express');

const { Minicup } = require('../../db/models');

const minicupRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

minicupRouter.get('/', verifyAccessToken, async (req, res) => {
  try {
    const minicups = await Minicup.findAll();
    res.json(minicups);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех миникупов ${error.message}` });
  }
});

minicupRouter.get('/manage/:id', verifyAccessToken, async (req, res) => {
  try {
    if (!res.locals.user) return res.status(500).send('Не передан юзер');
    const userid = res.locals.user.id;
    const minicup = await Minicup.findByPk(req.params.id);
    if (!minicup) {
      return res.status(404).send('Миникап не найден');
    }

    if (userid !== minicup.userid) {
      return res.status(403).send('У вас нет доступа к редактированию этого миникапа');
    }
    return res.json(minicup);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Ошибка при получении данных миникапа ${error.message}` });
  }
});

minicupRouter.post('/add', verifyAccessToken, async (req, res) => {
  try {
    const minicup = req.body;
    minicup.userid = res.locals.user.id;
    const newMinicup = await Minicup.create(minicup);
    res.status(200).json(newMinicup);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при создании миникапа ${error.message}` });
  }
});

minicupRouter.put('/manage/:id/', verifyAccessToken, async (req, res) => {
  try {
    if (!res.locals.user) return res.status(500).send('Не передан юзер');
    const userid = res.locals.user.id;
    const minicup = await Minicup.findByPk(req.params.id);
    if (!minicup) {
      return res.status(404).send('Миникап не найден');
    }
    if (userid !== minicup.userid) {
      return res.status(403).send('У вас нет доступа к редактированию этого миникапа');
    }
    const editedMinicup = await minicup.update({
      name: req.body.name || minicup.name,
      cityid: req.body.cityid || minicup.cityid,
      clubid: req.body.clubid || minicup.clubid,
      date: req.body.date || minicup.date,
      gembet: req.body.gembet || minicup.gembet,
    });
    return res.json(editedMinicup);
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Ошибка при обновлении миникапа: ${error.message}` });
  }
});

minicupRouter.delete('/manage/:id', verifyAccessToken, async (req, res) => {
  try {
    if (!res.locals.user) return res.status(500).send('Не передан юзер');
    const userid = res.locals.user.id;
    const minicup = await Minicup.findByPk(req.params.id);
    if (!minicup) {
      return res.status(404).send('Миникап не найден');
    }
    if (userid !== minicup.userid) {
      return res.status(403).send('У вас нет доступа к удалению этого миникапа');
    }
    await minicup.destroy();
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Ошибка при удалении миникапа: ${error.message}` });
  }
});

module.exports = minicupRouter;
