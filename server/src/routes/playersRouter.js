const { Router } = require('express');

const { Player, User, Club, Team, Transaction, Tournament } = require('../../db/models');

const playerRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

playerRouter.get('/', async (req, res) => {
  try {
    const players = await Player.findAll({
      include: {
        model: Club,
        as: 'Club',
        attributes: ['ticker'],
      },
    });
    res.json(players);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при получении всех игроков ${error.message}` });
  }
});

playerRouter.get('/myteam/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const teamPlayers = await Team.findAll({
      where: { ownerid: userId },
      include: {
        model: Player,
        as: 'player',
        include: {
          model: Club,
          as: 'Club',
          attributes: ['ticker'],
        },
      },
    });
    res.json(teamPlayers);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех игроков: ${error.message}` });
  }
});

playerRouter.post('/buy/:playerId/:userId', verifyAccessToken, async (req, res) => {
  try {
    const { playerId } = req.params;
    const { userId } = req.params;
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).send('Игрок не найден');
    }
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }

    user.coins -= player.costcoins;
    await user.save();

    await Team.create({
      ownerid: userId,
      playerid: playerId,
      level: 0,
      exp: 0,
      tournaments: 0,
      pointsgain: 0,
      coinsprofit: 0,
      gemsprofit: 0,
      stats: '[]',
    });
    await Transaction.create({
      userId,
      type: 'buyPlayer',
      playerId,
      amount: player.costcoins,
    });

    res.status(200).send('Игрок успешно куплен');
  } catch (error) {
    res.status(500).json({ error: `Ошибка при покупке игрока: ${error.message}` });
  }
});

playerRouter.post('/getPlayersByGomafiaIds', async (req, res) => {
  try {
    const { gomafiaIds } = req.body;
    if (!Array.isArray(gomafiaIds)) {
      return res
        .status(400)
        .json({ error: 'Invalid input, expected an array of gomafiaIds' });
    }

    const players = await Player.findAll({
      where: {
        gomafiaId: gomafiaIds,
      },
    });

    const foundGomafiaIds = players.map((player) => player.gomafiaId);
    const notFoundIds = gomafiaIds.filter((id) => !foundGomafiaIds.includes(id));

    res.json({
      players,
      notFoundIds: notFoundIds.length > 0 ? notFoundIds : 'All players found',
    });
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = playerRouter;
