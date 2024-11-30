const { Router } = require('express');

const { Tournament, City, Player } = require('../../db/models');

const tournamentRouter = Router();

tournamentRouter.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.json(tournaments);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех турниров ${error.message}` });
  }
});

tournamentRouter.get('/details/:id', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const tournamentData = await Tournament.findByPk(tournamentId);
    res.json(tournamentData);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении информации о турнире: ${error.message}` });
  }
});

tournamentRouter.post('/add', async (req, res) => {
  try {
    const tournament = req.body;
    const newTournament = await Tournament.create(tournament);
    res.status(201).json(newTournament);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при добавлении турнира: ${error.message}` });
  }
});

tournamentRouter.patch('/update/:id', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const updatesData = req.body;

    const [updatedRowsCount, updatedRows] = await Tournament.update(updatesData, {
      where: { id: tournamentId },
      returning: true,
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ error: 'Турнир не найден' });
    }
    const updatedTournament = updatedRows[0];

    // if (updatedTournament.resultTable) {
    //   let result = JSON.parse(updatedTournament.resultTable);
    //   result = result.map((item) => ({
    //     login: (item.login).toLowerCase(),
    //     sum: Number(item.sum) * 2,
    //   }));
    //   let tournamentPlayers = await Player.findAll();
    //   tournamentPlayers = tournamentPlayers.map((player) => {
    //     player.nickname = (player.nickname).toLowerCase();
    //     return player;
    //   });
    //   result = result.map((item) => {
    //     const tPlayer = tournamentPlayers.find((player) => player.nickname === item.login);
    //     if (tPlayer) {
    //       item.id = tPlayer.id;
    //     }
    //     return item;
    //   });
    //   }

    const { resultTable, ...responseWithoutResultTable } = updatedTournament.get({
      plain: true,
    });

    res.json(responseWithoutResultTable);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при обновлении турнира: ${error.message}` });
  }
});

tournamentRouter.delete('/delete/:id', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const deletedRowsCount = await Tournament.destroy({
      where: { id: tournamentId },
    });
    if (deletedRowsCount === 0) {
      return res.status(404).json({ error: 'Турнир не найден' });
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: `Ошибка при удалении турнира: ${error.message}` });
  }
});

tournamentRouter.get('/cities', async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении списка городов: ${error.message}` });
  }
});

module.exports = tournamentRouter;
