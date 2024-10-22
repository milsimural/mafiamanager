const {Router} = require('express')

const { Tournament } = require('../../db/models');

const tournamentRouter = Router();

tournamentRouter.get('', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.json(tournaments);
  } catch (error) {
    res
      .status(500)
      .json({ error: `Ошибка при получении всех турниров ${error.message}` });
  }
});

tournamentRouter.get('/:id', async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const tournamentData = await Tournament.findByPk(tournamentId);
        res.json(tournamentData);
    } catch (error) {
        res.status(500).json({error: `Ошибка при получении информации о турнире: ${error.message}`})
    }
})

tournamentRouter.post('/add', async (req, res) => {
    try {
        const tournament = req.body;
        const newTournament = await Tournament.create(tournament);
        res.status(201).json(newTournament);
    } catch (error) {
        res.status(500).json({error: `Ошибка при добавлении турнира: ${error.message}`})
    }
})

tournamentRouter.patch('/update/:id', async (req, res) => {
    try {
        const tournamentId = req.params.id;
        const updatesData = req.body;

        const [updatedRowsCount, updatedRows] = await Tournament.update(updatesData, {
            where: { id: tournamentId},
            returning: true,
        })

        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'Турнир не найден' });
          }
        const updatedTournament = updatedRows[0];
        res.json(updatedTournament);
    } catch (error) {
        res.status(500).json({ error: `Ошибка при обновлении турнира: ${error.message}` });
    }
})



module.exports = tournamentRouter;