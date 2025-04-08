const { Router } = require('express');

const { Tournament, City, Player } = require('../../db/models');

const tournamentRouter = Router();

tournamentRouter.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.findAll();
    res.json({
      tournaments,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: `Ошибка при получении всех турниров ${error.message}`,
      serverTime: new Date().toISOString(),
    });
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

tournamentRouter.patch('/update-x-by-stars', async (req, res) => {
  try {
    // Правила обновления
    const updateRules = {
      6: 80,
      5: 60,
      4: 50,
      3: 30,
      2: 20,
      0: 10,
    };

    // Статистика
    const stats = {};

    // Используем транзакцию для надежности
    const transaction = await Tournament.sequelize.transaction();

    try {
      // 1. Получаем все турниры, которые нужно обновить
      const tournamentsToUpdate = await Tournament.findAll({
        where: {
          star: Object.keys(updateRules).map(Number),
        },
        transaction,
      });

      // 2. Группируем турниры по новым значениям X
      const groupedUpdates = {};
      tournamentsToUpdate.forEach((tournament) => {
        const newX = updateRules[tournament.star];
        if (!groupedUpdates[newX]) {
          groupedUpdates[newX] = [];
        }
        groupedUpdates[newX].push(tournament.id);
      });

      // 3. Выполняем массовые обновления для каждой группы
      const updatePromises = Object.entries(groupedUpdates).map(([xValue, ids]) => {
        stats[xValue] = ids.length;
        return Tournament.update(
          { x: xValue },
          {
            where: { id: ids },
            transaction,
          },
        );
      });

      // 4. Ждем выполнения всех обновлений
      await Promise.all(updatePromises);

      // 5. Фиксируем транзакцию
      await transaction.commit();

      res.json({
        message: `Значения X успешно обновлены для ${tournamentsToUpdate.length} турниров`,
        stats,
      });
    } catch (error) {
      // Откатываем транзакцию при ошибке
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error('Ошибка при обновлении турниров:', error);
    res.status(500).json({
      error: `Ошибка при обновлении турниров: ${error.message}`,
    });
  }
});

module.exports = tournamentRouter;
