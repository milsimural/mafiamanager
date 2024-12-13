const { Router } = require('express');
const { Op } = require('sequelize');

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

playerRouter.post('/sell/:playerId/:userId', verifyAccessToken, async (req, res) => {
  const { playerId, userId } = req.params;

  try {
    const player = await Player.findByPk(playerId);
    if (!player) {
      return res.status(404).send('Игрок не найден');
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }

    const existingEntry = await Team.findOne({
      where: { playerid: playerId, ownerid: userId },
    });
    if (!existingEntry) {
      return res.status(423).send('Такого игрока у вас нет');
    }

    await existingEntry.destroy();

    user.coins += player.costcoins;

    await user.save();

    await Transaction.create({
      userId,
      type: 'sellPlayer',
      playerId,
      amount: player.costcoins,
    });

    res.status(200).json(user.coins);
  } catch (error) {
    console.error('Ошибка при продаже игрока:', error);
    res.status(500).send('Произошла ошибка при продаже игрока');
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

    const existingEntry = await Team.findOne({
      where: { playerid: playerId, ownerid: userId },
    });
    if (existingEntry) {
      return res.status(423).send('Игрок уже куплен');
    }

    if (player.costcoins > user.coins) {
      return res.status(400).send('Недостаточно монет');
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

    res.status(200).json(user.coins);
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

playerRouter.get('/getTournamentPlayersArray/:tournamentId/:userId', async (req, res) => {
  try {
    const { tournamentId, userId } = req.params;
    if (Number.isNaN(tournamentId) || Number.isNaN(userId)) {
      return res.status(400).send('Некорректные параметры ввода');
    }

    // Ищем турнир
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) {
      return res.status(404).send('Турнир не найден');
    }

    const arrayPlayers = tournament.playersList.slice(1, -1).split(',').map(Number);

    if (!Array.isArray(arrayPlayers) || arrayPlayers.length === 0) {
      return res.status(404).send(`Игроки турнира не найдены: ${tournament.playersList}`);
    }

    // нашли всех игроков из БД которые играют на турнире
    const tournamentPlayers = await Player.findAll({
      where: {
        id: arrayPlayers,
      },
    });

    if (tournamentPlayers.length === 0) {
      return res.status(404).send('Игроки на турнире не найдены');
    }

    // Нашли всех игроков в моей команде
    const userPlayers = await Team.findAll({
      where: {
        ownerid: userId,
      },
    });

    if (userPlayers.length === 0) {
      for (let i = 0; i < tournamentPlayers.length; i++) {
        tournamentPlayers[i] = tournamentPlayers[i].get({ plain: true });
        tournamentPlayers[i].isInTeam = false;
      }
      return res.status(200).json(tournamentPlayers);
    }

    // Сохранили id игроков моей команды в массив
    const userPlayersIds = userPlayers.map((player) => player.playerid);

    // Пометили всех игроков турнира которые есть в моей команде
    for (let i = 0; i < tournamentPlayers.length; i++) {
      if (userPlayersIds.includes(tournamentPlayers[i].id)) {
        tournamentPlayers[i] = tournamentPlayers[i].get({ plain: true });
        tournamentPlayers[i].isInTeam = true;
      } else {
        tournamentPlayers[i] = tournamentPlayers[i].get({ plain: true });
        tournamentPlayers[i].isInTeam = false;
      }
    }

    return res.json(tournamentPlayers);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении списка игроков турнира: ${error.message}` });
  }
});

// Находит обьекты всех игроков играющих на турнире
playerRouter.get('/getTournamentPlayersAll/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findByPk(tournamentId);

    if (!tournament) {
      return res.status(404).send('Турнир не найден');
    }

    const playersList = JSON.parse(tournament.playersList);

    // Проверьте, что playersList - это массив
    if (!Array.isArray(playersList)) {
      return res.status(400).send('Список игроков турнира некорректен');
    }

    const tournamentPlayers = await Player.findAll({
      where: {
        id: {
          [Op.in]: playersList,
        },
      },
    });

    if (tournamentPlayers.length === 0) {
      return res.status(404).send('Не удалось найти игроков в базе с турнира');
    }

    res.json(tournamentPlayers);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении списка игроков турнира: ${error.message}` });
  }
});

module.exports = playerRouter;
