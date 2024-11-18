const { Router } = require('express');

const { Player, Club } = require('../../db/models');

const playerRouter = Router();

playerRouter.get('/', async (req, res) => {
  try {
    const players = await Player.findAll({
      include: {
        model: Club,
        attributes: ['ticker'],
      },
    });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при получении всех игроков ${error.message}` });
  }
});

playerRouter.post('/add', async (req, res) => {
  try {
    const player = req.body;
    const newPlayer = await Player.create(player);
    res.status(200).json(newPlayer);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при создании игрока ${error.message}` });
  }
});

module.exports = playerRouter;
