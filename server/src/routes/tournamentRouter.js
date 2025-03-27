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

// Найти все турниры
// Турниры где stars = 6 установть x на 140
// Турниры где stars = 5 установить x на 120
// Турниры где stars = 4 установить x на 100
// Турниры где stars = 3 установить x на 80
// Турниры где stars = 2 устновить x на 60
// Турниры где stars = 0 установить x на 40

module.exports = tournamentRouter;
