const { Router } = require('express');
const { Tournament, Player, Team, Roster } = require('../../db/models');
const constractRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

// constractRouter.get('/getrosters/:tournamentId', async (req, res) => {
//   try {
//     const { tournamentId } = req.params;
//     const rosters = await Roster.findAll({
//       where: { tournamentId },
//     });
//     res.json(rosters);
//   } catch (error) {
//     res.status(500).json({ error: `Ошибка при выгрузке ростеров: ${error.message}` });
//   }
// });

constractRouter.get('/getrosters/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const rosters = await Roster.findAll({
      where: { tournamentId },
    });

    // Для каждого ростера извлечём и добавим игроков
    const rostersWithPlayers = await Promise.all(
      rosters.map(async (roster) => {
        // Парсим строку с ID игроков
        const playerIds = JSON.parse(roster.rosterPlayers);

        // Получаем данные игроков из базы данных
        const players = await Player.findAll({
          where: {
            id: playerIds
          }
        });

        // Возвращаем ростер с вложенными данными игроков
        return {
          ...roster.toJSON(),
          players, // добавляем массив объектов игроков
        };
      })
    );

    res.json(rostersWithPlayers);
  } catch (error) {
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
          updatedRoster.averagePlace = totalPlaceSum / count;
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
    updatedRosters.sort((a, b) => a.averagePlace - b.averagePlace);

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

module.exports = constractRouter;
