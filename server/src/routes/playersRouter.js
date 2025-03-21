const { Router } = require('express');
const { Op, where } = require('sequelize');

const {
  Player,
  User,
  Club,
  Team,
  Transaction,
  Tournament,
  Roster,
} = require('../../db/models');

const playerRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

// Функция считает дубли
function countDuplicates(arr) {
  const arrWithoutNulls = arr.filter(Boolean);

  const count = {};

  arrWithoutNulls.forEach((item) => {
    count[item] = (count[item] || 0) + 1;
  });

  return Object.entries(count).map(([key, value]) => ({
    value: key,
    count: value,
  }));
}

// Роут отдает список всех спортсменов
// И добавляет к ним еще данные о Тикере клуба
playerRouter.get('/', async (req, res) => {
  try {
    const players = await Player.findAll({
      include: {
        model: Club,
        as: 'Club',
        attributes: ['ticker', 'icon'],
      },
    });

    // Если игроков нет, возвращаем пустой массив
    if (!players || players.length === 0) {
      return res.status(200).json([]);
    }

    // Возвращаем данные об игроках
    res.status(200).json(players);
  } catch (error) {
    // Логируем ошибку для отладки
    console.error('Ошибка при получении игроков:', error);

    // Возвращаем более информативное сообщение об ошибке
    res.status(500).json({
      error: 'Ошибка при получении данных об игроках',
      details: error.message,
    });
  }
});
// Роут отдает спортсменов по клубу
playerRouter.get('/byClub/:clubId', async (req, res) => {
  const { clubId } = req.params;
  try {
    const players = await Player.findAll({
      where: {
        [Op.and]: [
          // Используем Op.and для объединения условий
          { clubId }, // Условие по clubId
          { ismarket: true }, // Условие по isMarket
        ],
      },
      include: {
        model: Club,
        as: 'Club',
        attributes: ['ticker', 'icon'],
      },
      order: [['costcoins', 'DESC']], // Сортировка по costcoins от большего к меньшему
    });
    res.json(players);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех игроков: ${error.message}` });
  }
});

// Роут отдает спортсменов юзера с тикерами клуба
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

// Админ обновляет спортсмена
playerRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPlayer = await Player.update(req.body, {
      where: { id },
    });
    res.json(updatedPlayer);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при обновлении игрока: ${error.message}` });
  }
});

// Юзер продает игрока
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

    if (player.dismissals == null) {
      player.dismissals = 1;
    } else {
      player.dismissals += 1;
    }
    await player.save();

    res.status(200).json(user.coins);
  } catch (error) {
    console.error('Ошибка при продаже игрока:', error);
    res.status(500).send('Произошла ошибка при продаже игрока');
  }
});

// Функция создания статов

// Вспомогательная функция для генерации случайного числа в диапазоне
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateObject() {
  // Создаем массив, где каждая буква повторяется пропорционально её вероятности
  const grades = [
    ...Array(10).fill('S'), // 10% для S
    ...Array(20).fill('A'), // 20% для A
    ...Array(30).fill('B'), // 30% для B
    ...Array(40).fill('C'), // 40% для C
  ];

  // Выбираем случайный элемент из массива
  const grade = grades[Math.floor(Math.random() * grades.length)];

  // Генерация Max параметров в зависимости от буквы
  let redMax;
  let blackMax;
  let sherifMax;
  let donMax;
  let lhMax;

  switch (grade) {
    case 'C':
      redMax = getRandomNumber(20, 80);
      blackMax = getRandomNumber(20, 80);
      sherifMax = getRandomNumber(20, 80);
      donMax = getRandomNumber(20, 80);
      lhMax = getRandomNumber(20, 80);
      break;
    case 'B':
      redMax = getRandomNumber(60, 130);
      blackMax = getRandomNumber(60, 130);
      sherifMax = getRandomNumber(60, 130);
      donMax = getRandomNumber(60, 130);
      lhMax = getRandomNumber(60, 130);
      break;
    case 'A':
      redMax = getRandomNumber(90, 210);
      blackMax = getRandomNumber(90, 210);
      sherifMax = getRandomNumber(90, 210);
      donMax = getRandomNumber(90, 210);
      lhMax = getRandomNumber(90, 210);
      break;
    case 'S':
      redMax = getRandomNumber(120, 300);
      blackMax = getRandomNumber(120, 300);
      sherifMax = getRandomNumber(120, 300);
      donMax = getRandomNumber(120, 300);
      lhMax = getRandomNumber(120, 300);
      break;
    default:
      throw new Error('Неизвестная буква');
  }

  // Генерация Cur параметров в зависимости от буквы
  let redCur;
  let blackCur;
  let sherifCur;
  let donCur;
  let lhCur;

  switch (grade) {
    case 'C':
      redCur = getRandomNumber(0, 10);
      blackCur = getRandomNumber(0, 10);
      sherifCur = getRandomNumber(0, 10);
      donCur = getRandomNumber(0, 10);
      lhCur = getRandomNumber(0, 10);
      break;
    case 'B':
      redCur = getRandomNumber(0, 30);
      blackCur = getRandomNumber(0, 30);
      sherifCur = getRandomNumber(0, 30);
      donCur = getRandomNumber(0, 30);
      lhCur = getRandomNumber(0, 30);
      break;
    case 'A':
      redCur = getRandomNumber(0, 50);
      blackCur = getRandomNumber(0, 50);
      sherifCur = getRandomNumber(0, 50);
      donCur = getRandomNumber(0, 50);
      lhCur = getRandomNumber(0, 50);
      break;
    case 'S':
      redCur = getRandomNumber(0, 65);
      blackCur = getRandomNumber(0, 65);
      sherifCur = getRandomNumber(0, 65);
      donCur = getRandomNumber(0, 65);
      lhCur = getRandomNumber(0, 65);
      break;
    default:
      throw new Error('Неизвестная буква');
  }

  // Возвращаем сгенерированный объект
  return {
    grade,
    redMax,
    redCur,
    blackMax,
    blackCur,
    sherifMax,
    sherifCur,
    donMax,
    donCur,
    lhMax,
    lhCur,
  };
}

// Купить спортсмена
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

    // Создаем статы

    await Team.create({
      ownerid: userId,
      playerid: playerId,
      level: 0,
      exp: 0,
      tournaments: 0,
      pointsgain: 0,
      coinsprofit: 0,
      gemsprofit: 0,
      stats: JSON.stringify(generateObject()),
    });
    await Transaction.create({
      userId,
      type: 'buyPlayer',
      playerId,
      amount: player.costcoins,
    });

    if (player.transfers == null) {
      player.transfers = 1;
    } else {
      player.transfers += 1;
    }
    await player.save();

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

// Найти все ростеры турнира и занести в массив игроков всех игроков каждого ростера
playerRouter.get('/getRosresPlayersArrayWithSum/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const tournament = await Tournament.findByPk(tournamentId);

    if (!tournament) {
      return res.status(404).send('Турнир не найден');
    }

    const rosters = await Roster.findAll({
      where: { tournamentId },
    });

    if (rosters.length === 0) {
      return res.status(404).send('Ростеры турнира не найдены');
    }

    const playersArray = rosters.flatMap((roster) => JSON.parse(roster.rosterPlayers));
    const sumPlayers = countDuplicates(playersArray);

    const promises = sumPlayers.map(async (playerData) => {
      const id = Number(playerData.value);
      if (isNaN(id)) {
        throw new Error(
          `Неверное значение id игрока - ${id}, из ${JSON.stringify(playerData)}`,
        );
      }

      const player = await Player.findByPk(id);
      const updatedPlayerData = { ...playerData };

      if (player && player.nickname) {
        updatedPlayerData.nickname = player.nickname;
      }

      return updatedPlayerData;
    });

    const updatedPlayers = await Promise.all(promises);
    res.json(updatedPlayers);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении списка игроков турнира: ${error.message}` });
  }
});

module.exports = playerRouter;
