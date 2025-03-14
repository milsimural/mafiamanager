const { Router } = require('express');
const {
  Tournament,
  Player,
  Team,
  Roster,
  User,
  Transaction,
} = require('../../db/models');
const constractRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

constractRouter.get('/rosters/:tournamentId', async (req, res) => {
  const { tournamentId } = req.params;

  try {
    const rosters = await Roster.findAll({
      where: { tournamentId },
      attributes: [
        'id',
        'userId',
        'tournamentId',
        'rosterPlayers',
        'teamPlayers',
        'isClose',
        'isOver',
        'profitCoins',
        'profitGems',
        'profitItems',
        'place',
        'perpCount',
        'averagePlace',
        'isTakeProfit',
      ],
    });

    res.json(rosters);
  } catch (error) {
    console.error('Error retrieving rosters:', error);
    res.status(500).json({ error: 'Ошибка при получении ростеров' });
  }
});

constractRouter.get('/getrosters/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const rosters = await Roster.findAll({
      where: { tournamentId },
      attributes: [
        'id',
        'userId',
        'tournamentId',
        'rosterPlayers',
        'teamPlayers',
        'isClose',
        'isOver',
        'profitCoins',
        'profitGems',
        'profitItems',
        'place',
        'perpCount',
        'averagePlace',
        'isTakeProfit',
      ],
    });

    const rostersWithDetails = await Promise.all(
      rosters.map(async (roster) => {
        const playerIds = JSON.parse(roster.rosterPlayers);

        const players = await Player.findAll({
          where: {
            id: playerIds,
          },
        });

        const playerMap = new Map(players.map((player) => [player.id, player]));

        // Сортируем игроков в соответствии с порядком playerIds
        const sortedPlayers = playerIds.map((id) => playerMap.get(id));

        const user = await User.findByPk(roster.userId, {
          attributes: ['name'], // извлекаем только имя
        });

        // Включаем id в результаты
        return {
          id: roster.id, // убедимся, что id включен
          ...roster.toJSON(),
          players: sortedPlayers.map((player) => player || { nickname: 'КАПИТАНА НЕТ' }), // используем отсортированный массив игроков
          userName: user ? user.name : null,
        };
      }),
    );

    res.json(rostersWithDetails);
  } catch (error) {
    console.error('Error retrieving rosters:', error);
    res.status(500).json({ error: `Ошибка при выгрузке ростеров: ${error.message}` });
  }
});

constractRouter.patch('/closeRosters/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const rosters = await Roster.update({ isClose: true }, { where: { tournamentId } });
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при закрытии ростеров: ${error.message}` });
  }
});

constractRouter.patch('/openRosters/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const rosters = await Roster.update({ isClose: false }, { where: { tournamentId } });
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при открытии ростеров: ${error.message}` });
  }
});

constractRouter.post(
  '/add/:userId/:tournamentId',
  verifyAccessToken,
  async (req, res) => {
    try {
      const { userId, tournamentId } = req.params;
      const { rosterPlayers, teamPlayers } = req.body;

      const tournament = await Tournament.findByPk(tournamentId);

      if (!tournament) {
        return res.status(404).json({ error: 'Турнир не найден' });
      }

      if (tournament.rosterFinish) {
        return res.status(400).json({ error: 'Изменение ростера закрыто' });
      }

      const roster = {
        userId,
        tournamentId,
        rosterPlayers,
        teamPlayers: null,
        isClose: false,
        isOver: false,
        profitCoins: 0,
        profitGems: 0,
        profitItems: '',
        place: 0,
        perpCount: tournament.projected_count_of_participants,
        averagePlace: 0,
        isTakeProfit: false,
      };

      const newRoster = await Roster.create(roster);

      res.status(201).json(newRoster);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Ошибка при создании заявки на турнир: ${error.message}` });
    }
  },
);

constractRouter.get('/getroster/:userId/:tournamentId', async (req, res) => {
  try {
    const { userId, tournamentId } = req.params;
    const roster = await Roster.findOne({
      where: { userId, tournamentId },
    });

    if (!roster) {
      return res.status(404).json({ error: 'Заявка на турнир не найдена' });
    }

    res.json(roster);
  } catch (error) {
    console.error('Ошибка при выгрузке заявки на турнир:', error);
    res
      .status(500)
      .json({ error: `Ошибка при выгрузке заявки на турнир: ${error.message}` });
  }
});

constractRouter.patch(
  '/update/:userId/:tournamentId',
  verifyAccessToken,
  async (req, res) => {
    try {
      const { userId, tournamentId } = req.params;
      const rosterData = req.body;

      const tournament = await Tournament.findByPk(tournamentId);

      if (!tournament) {
        return res.status(404).json({ error: 'Турнир не найден' });
      }

      if (tournament.rosterFinish) {
        return res.status(400).json({ error: 'Изменение ростера закрыто' });
      }

      const [updatedRowsCount, updatedRows] = await Roster.update(rosterData, {
        where: { userId, tournamentId },
        returning: true,
      });

      if (updatedRowsCount === 0) {
        return res.status(404).json({ error: 'Заявка на турнир не найдена' });
      }

      const updatedRoster = updatedRows[0];
      res.json(updatedRoster);
    } catch (error) {
      res
        .status(500)
        .json({ error: `Ошибка при обновлении заявки на турнир: ${error.message}` });
    }
  },
);

// Этот класс нужен для лучшего написания ошибки
class RosterUpdateError extends Error {
  constructor(message, details) {
    super(message);
    this.details = details;
  }
}

// Обновление всех ростеров турнира
constractRouter.patch('/setProfitAndPlaces/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const resultTable = req.body;

    if (!Array.isArray(resultTable)) {
      return res.status(400).json({ error: 'Ожидался массив resultTable.', resultTable });
    }

    let rosters;
    try {
      rosters = await Roster.findAll({
        where: { tournamentId },
        attributes: [
          'id',
          'userId',
          'tournamentId',
          'rosterPlayers',
          'teamPlayers',
          'isClose',
          'isOver',
          'profitCoins',
          'profitGems',
          'profitItems',
          'place',
          'perpCount',
          'averagePlace',
          'isTakeProfit',
        ],
      });
    } catch (error) {
      return res
        .status(511)
        .json({ error: `Ошибка при получении ростеров турнира: ${error.message}` });
    }

    if (!rosters || rosters.length === 0) {
      return res
        .status(404)
        .json({ error: 'Ростеры турнира не найдены или нет турнира' });
    }

    await Promise.all(
      rosters.map(async (roster) => {
        const rosterPlayers = JSON.parse(roster.rosterPlayers);

        if (!Array.isArray(rosterPlayers)) {
          throw new Error('rosterPlayers не является массивом');
        }

        let count = 0;
        let profitCoins = 0;
        let totalPlaceSum = 0;

        const updatedRoster = { ...roster };

        resultTable.forEach((player) => {
          if (!player.id) {
            throw new Error('Проблемы с player.id');
          }
          if (!Number.isFinite(player.sum)) {
            throw new Error('Проблемы с player.sum - либо его нет, либо это не число');
          }
          if (rosterPlayers.includes(player.id)) {
            count += 1;
            profitCoins += Number(player.sum);
            totalPlaceSum += Number(player.place);
          }
        });

        if (count > 0) {
          // Ранее я делил места на кол-во участников в ростере, но это не правильно
          // updatedRoster.averagePlace = totalPlaceSum / count;
          // Сейчас я делю на максимальное кол-во участников в ростере т.е. 7
          updatedRoster.averagePlace = totalPlaceSum / 7;
          updatedRoster.profitCoins = Math.floor(profitCoins);
        }

        if (!roster.id) {
          throw new Error('Проблемы с roster.id');
        }

        try {
          await Roster.update(
            {
              profitCoins: updatedRoster.profitCoins,
              averagePlace: updatedRoster.averagePlace,
            },
            {
              where: { id: roster.id },
            },
          );
        } catch (updateError) {
          throw new RosterUpdateError(
            `Ошибка при обновлении ростера: ${updateError.message}`,
            {
              attemptedUpdate: {
                profitCoins: updatedRoster.profitCoins,
                averagePlace: updatedRoster.averagePlace,
              },
              rosterId: roster.id,
              updatedRoster,
            },
          );
        }
      }),
    );

    const updatedRosters = await Roster.findAll({
      where: { tournamentId },
    });

    // Сортируем составы по их среднему месту
    // updatedRosters.sort((a, b) => a.averagePlace - b.averagePlace);

    // Сортируем составы по количеству заработанных денег
    updatedRosters.sort((a, b) => b.profitCoins - a.profitCoins);

    // Создаем массив промисов для сохранения изменений
    const savePromises = updatedRosters.map((roster, index) => {
      roster.set('place', index + 1); // Устанавливаем новое место
      return roster.save(); // Возвращаем промис
    });

    // Ожидаем выполнения всех операций сохранения
    await Promise.all(savePromises);

    return res.status(200).json({ message: 'Свойства ростеров успешно обновлены.' });
  } catch (error) {
    if (error instanceof RosterUpdateError)
      return res.status(500).json({ error: error.message, details: error.details });

    return res
      .status(500)
      .json({ error: `Ошибка при обновлении данных ростеров: ${error.message}` });
  }
});

constractRouter.get('/checkPlayerInLiveRosters/:userId/:number', async (req, res) => {
  const { userId, number } = req.params;

  try {
    // Находим ростеры пользователя с isOver = false или null
    const rosters = await Roster.findAll({
      where: {
        userId,
        isOver: [false, null],
      },
    });

    // Проверяем каждый ростер
    const numberExists = rosters.some((roster) => {
      // Преобразуем строку с числовым массивом в реальный массив
      const rosterPlayersArray = JSON.parse(roster.rosterPlayers);
      return rosterPlayersArray.includes(Number(number));
    });

    res.json({ result: numberExists });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while checking the roster' });
  }
});

// Найти все ростеры по id турнира и изменить isOver на true
constractRouter.patch('/overRosters/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const rosters = await Roster.update({ isOver: true }, { where: { tournamentId } });
    res.json(rosters);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при закрытии ростеров: ${error.message}` });
  }
});

constractRouter.patch('/takeProfit/:rosterId', async (req, res) => {
  const { rosterId } = req.params;
  console.log(`Looking for roster with ID: ${rosterId}`);

  try {
    const roster = await Roster.findOne({
      where: {
        id: rosterId,
      },
    });

    if (!roster) {
      return res.status(404).json({ error: 'Roster not found' });
    }

    if (roster.isTakeProfit) {
      return res.status(400).json({ error: 'The profit has already been taken' });
    }

    const user = await User.findByPk(roster.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Обновляем количество монет у пользователя
    user.coins += roster.profitCoins;
    await user.save();

    // Обновляем статус ростера
    roster.isTakeProfit = true;
    await roster.save(); // Сохраняем обновленный ростер

    // Создаем транзакцию получения профита
    const transaction = await Transaction.create({
      userId: user.id,
      amount: roster.profitCoins,
      type: 'takeProfit',
    });

    res.json(roster); // Возвращаем обновленный объект ростера
  } catch (error) {
    console.error('Error updating roster:', error);
    res.status(500).json({ error: 'An error occurred while updating the roster' });
  }
});

// Найти все ростеры игрока и сумировать их profitCoins
constractRouter.get('/playerRosters/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const rosters = await Roster.findAll({ where: { userId } });
    const totalProfit = rosters.reduce((total, roster) => total + roster.profitCoins, 0);
    res.json({ totalProfit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while getting player rosters' });
  }
});

// Найти все ростеры каждого игрока и суммировать их profitCoins, создать новый массив где будет user.id, user.name и сумма profitCoins ростеров этого userId
constractRouter.get('/rating', async (req, res) => {
  try {
    const rosters = await Roster.findAll();
    const playerRosters = await Promise.all(
      rosters.map(async (roster) => {
        const user = await User.findByPk(roster.userId);
        return {
          userId: user.id,
          userName: user.name,
          profitCoins: roster.profitCoins,
        };
      }),
    );

    const allUsers = await User.findAll();

    const rating = [];
    for (let i = 0; i < allUsers.length; i++) {
      let totalProfit = 0;
      for (let j = 0; j < playerRosters.length; j++) {
        if (playerRosters[j].userId === allUsers[i].id) {
          totalProfit += playerRosters[j].profitCoins;
        }
      }
      rating.push({
        userId: allUsers[i].id,
        userName: allUsers[i].name,
        totalProfit,
      });
    }
    const ratingSort = rating.sort((a, b) => b.totalProfit - a.totalProfit);
    res.json(ratingSort);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while getting player rosters' });
  }
});

module.exports = constractRouter;
