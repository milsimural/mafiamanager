const { Router } = require('express');
const { Tournament, Player, Team, Roster } = require('../../db/models');
const constractRouter = Router();

const verifyAccessToken = require('../middlewares/verifyAccessToken');

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

constractRouter.patch('/closeRosters/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;
    const parsedBody = JSON.parse(req.body);
    const { resultTable } = parsedBody;

    const rosters = await Roster.findAll({
      where: { tournamentId },
    });

    if (!rosters || rosters.length === 0) {
      return res
        .status(404)
        .json({ error: 'Ростеры турнира не найдены или нет турнира' });
    }

    await Promise.all(
      rosters.map(async (roster) => {
        const { rosterPlayers } = JSON.parse(roster.rosterPlayers);
        let count = 0;
        let totalPlaceSum = 0;

        // Создаем новый объект из ростера
        const updatedRoster = { ...roster };

        resultTable.forEach((player) => {
          if (rosterPlayers.includes(player.id)) {
            count += 1;
            updatedRoster.profitCoins += player.sum;
            totalPlaceSum += player.sum;
          }
        });

        if (count > 0) {
          updatedRoster.averagePlace = totalPlaceSum / count;
        }

        // Используем метод обновления для базы данных
        await Roster.update(
          {
            profitCoins: updatedRoster.profitCoins,
            averagePlace: updatedRoster.averagePlace,
          },
          {
            where: { id: roster.id },
          },
        );
      }),
    );

    res.status(200).json({ message: 'Свойства ростеров успешно обновлены.' });
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при обновлении ростеров турнира: ${error.message}` });
  }
});

module.exports = constractRouter;
