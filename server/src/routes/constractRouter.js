const { Router } = require('express');
const {
  Tournament,
  Player,
  Team,
  Roster,
  User,
  Transaction,
  Item,
  GiftConfig
} = require('../../db/models');
const constractRouter = Router();

const { Op } = require('sequelize');

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

      const old_participants_count = tournament.participants_count;

      const updatedTournament = await Tournament.update(
        { participants_count: old_participants_count + 1 },
        { where: { id: tournamentId } },
      );

      res.status(201).json([newRoster, updatedTournament]);
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
// Сюда пришли данные: [{login: 'zhirektor', sum: 2332.4, place: 1, id: 104}, ...]
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

// Найти все ростеры по id турнира и изменить isOver на true и меняем статус турнира на over
constractRouter.patch('/overRosters/:tournamentId', async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Закрываем ростеры турнира
    const updatedRosters = await Roster.update(
      { isOver: true },
      { where: { tournamentId } },
    );

    // Меняем статус турнира на 'over'
    const updatedTournament = await Tournament.update(
      { status: 'over' },
      { where: { id: tournamentId } },
    );

    res.json({
      rosters: updatedRosters,
      tournament: updatedTournament,
    });
  } catch (error) {
    res.status(500).json({
      error: `Ошибка при закрытии турнира: ${error.message}`,
    });
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

    // Обновляем количество монет и алмазов у пользователя
    user.coins += roster.profitCoins;
    user.gems += roster.profitGems;

    // Сохраянем все
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

    const transactionGems = await Transaction.create({
      userId: user.id,
      amount: roster.profitGems,
      type: 'takeProfitGems'
    })

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
    res.status(500).json({ error: 'An error occurred while getting player rosters', text: error.message });
  }
});


// Сделаем функцию случайной генерации
function getRandomElementFromArray(arr) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

// Функция обновления ростеров
async function updateRosters(filteredRosters, usersBounty) {
  const result = [];
  // eslint-disable-next-line no-restricted-syntax
  for (const roster of filteredRosters) {
    const profitData = usersBounty.find((userB) => userB.userId === roster.userId);
    // eslint-disable-next-line no-continue
    if (!profitData) continue;

    try {
      // Обновляем coins и gems с проверкой на null/undefined
      roster.profitCoins = (roster.profitCoins || 0) + (profitData.coins || 0);
      roster.profitGems = profitData.gems || 0;

      // Глубокая копия массива itemsArray
      roster.profitItems = JSON.stringify(structuredClone(profitData.itemsArray) || []);

      // Асинхронное сохранение с обработкой ошибок
      // eslint-disable-next-line no-await-in-loop
      await roster.save();
      result.push(roster);
    } catch (error) {
      result.push(`ERROR: ${error.text} - ${roster.id}`);
    }
  }
  return result;
}

// Найти все ростеры по id турнира, выбрать пользователей с местами от 1 до 10 и сгенерировать призы которые они получат и записать их в поле profitItems
constractRouter.get('/setGifts/:tournamentId', async (req, res) => {
  let resultOfUpdateRostersWithGifts;
    const { tournamentId } = req.params;
    // Найдем все ростеры турнира
    const rosters = await Roster.findAll({ where: { tournamentId } });
    if(!rosters) {
      return res.status(404).json({ error: 'Rosters not found' });
    }
    // Теперь отфильтруем только тех кто занял с 1 по 10 место
    const filteredRosters = rosters.filter(roster => roster.place <= 10);

    // Проверка что в ростере уже есть предметы и тогда возврат (чтобы избежать двойного начисления)
    const firstPlace = filteredRosters.find(roster => roster.place === 1);
    if(firstPlace.profitItems) {
      return res.status(400).json({ error: 'First place already has items' });
    }

    // Найдем все item в которых grade не равен null (так как нам нужны только те у которых есть значение 5, 10, 15 итп)
    const items = await Item.findAll({where: 
      {grade: 
        {[Op.ne]: null}
      }
    })
    if(!items) {
      return res.status(404).json({ error: 'Items not found' });
    }

    // Теперь получим данные какой giftconfig у этого турнира (id)
    const tournament = await Tournament.findByPk(tournamentId);
    if(!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    const {giftConfigId} = tournament;
    // Найдем его
    const giftConfig = await GiftConfig.findByPk(giftConfigId);
    if(!giftConfig) {
      return res.status(404).json({ error: 'GiftConfig not found' });
    }

    try { giftConfig.coins = typeof giftConfig.coins === 'string' ? JSON.parse(giftConfig.coins) : giftConfig.coins;
      giftConfig.gems = typeof giftConfig.gems === 'string' ? JSON.parse(giftConfig.gems) : giftConfig.gems;
      giftConfig.randomItems = typeof giftConfig.randomItems === 'string' ? JSON.parse(giftConfig.randomItems) : giftConfig.items; }
    catch (error) {
      return res.status(500).json({ error: 'Failed to parse giftConfig', text: error.message });
    }
    
    // Создадим массив usersBounty из filteredRosters которые получат призы для отображения в фронте
    const usersBounty = filteredRosters.map(roster => ({
        userId: roster.userId,
        coins: 0,
        gems: 0,
        itemsSumGrades: 0,
        itemsArray: [],
        place: roster.place
    }));

    // В этот массив мы запишем данные какому юзеры какие призы полагаются
    try {
      for (let i = 0; i < 10; i++) {
        const user = usersBounty.find(item => item.place === i + 1);
        if (!user) {;
          // eslint-disable-next-line no-continue
          continue; // Пропускаем итерацию
        }
        user.coins = giftConfig.coins[i];
        user.gems = giftConfig.gems[i];
        user.itemsSumGrades = giftConfig.randomItems[i];
      }
    } catch (error) {
      return res.status(500).json({ error: 'Failed to assign prizes to users - первый фор не проходит', text: error.message, gc: giftConfig.coins[0], user: usersBounty.find(item => item.place === 1), arr: usersBounty } );
    }
    
    // Теперь нужно записать в массив itemsArray - случайные предметы
    try {
      for(let i = 0; i < usersBounty.length; i++) {
        const maxGrade = usersBounty[i].itemsSumGrades;
        let currentGrade = maxGrade; 
        const itemsArrayForGift = [];
        while(currentGrade > 0) {
          const randomItem = getRandomElementFromArray(items);
          // eslint-disable-next-line no-continue
          if (randomItem.grade > currentGrade) continue;
          itemsArrayForGift.push(randomItem.id);
          currentGrade -= randomItem.grade;
        }
        usersBounty[i].itemsArray = itemsArrayForGift;
      }
    } catch (error) {
      return res.status(522).json({ error: 'Ошибка ген. сл. предметов', text: error.message });
    }

    try {
      resultOfUpdateRostersWithGifts = await updateRosters(filteredRosters, usersBounty);
    } catch (error) {
      return res.status(500).json({ error: 'Ошибка при обновлении данных ростеров', text: error.message });
    }
    
    // Отправляем на клиент эти данные
    res.status(200).json({usersBounty, resultOfUpdateRostersWithGifts});
})


module.exports = constractRouter;
