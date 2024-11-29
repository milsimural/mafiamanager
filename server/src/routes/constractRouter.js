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

      if(tournament.rosterFinish) {
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

      if(tournament.rosterFinish) {
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

// constractRouter.get('/getresult/:userId/:tournamentId', async (req, res) => {
//   try {
//     const { userId, tournamentId } = req.params;
//     const roster = await Roster.findOne({
//       where: { userId, tournamentId },
//     });

//     if (!roster) {
//       return res.status(404).json({ error: 'Заявка на турнир не найдена' });
//     }

//     const tournament = await Tournament.findByPk(tournamentId);

//     if (!tournament) {
//       return res.status(404).json({ error: 'Турнир не найден' });
//     }

//     if(!tournament.resultTable) {
//       return res.status(404).json({ error: 'Результаты турнира не загружены' });
//     }

//     const result = JSON.parse(tournament.resultTable);


module.exports = constractRouter;
