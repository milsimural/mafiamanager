const { Router } = require('express');
const seasonRouter = Router();
const verifyAccessToken = require('../middlewares/verifyAccessToken');

const { Season } = require('../../db/models');
const giftconfig = require('../../db/models/giftconfig');

// seasonRouter.get('/', verifyAccessToken, async (req, res) => {
//     const serverDate = new Date().toISOString().split('T')[0]
//   try {
//     const seasons = await Season.findAll({
//     });
//     const seasonsInstance = [...seasons];
//     for(let i = 0; i < seasonsInstance.length; i++) {
//         seasonsInstance[i].start = new Date(seasonsInstance[i].start.toISOString().split('T')[0]);
//         seasonsInstance[i].end = new Date(seasonsInstance[i].end.toISOString().split('T')[0]);
//     }
//     const response = [...seasonsInstance, serverDate];
//     res.json(response);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: `Ошибка при получении списка сезонов ${error.message}` });
//   }
// });

seasonRouter.get('/', verifyAccessToken, async (req, res) => {
    const serverDate = new Date().toISOString().split('T')[0];
  
    try {
      // Получаем данные из базы
      const seasons = await Season.findAll({});
  
      // Преобразуем данные для ответа
      const formattedSeasons = seasons.map(season => ({
        title: season.title,
        start: season.start.toISOString().split('T')[0], // Форматируем дату начала
        end: season.end.toISOString().split('T')[0],    // Форматируем дату окончания
        picture: season.picture,
      }));
  
      // Формируем ответ
      const response = {
        seasons: formattedSeasons, // Преобразованные данные
        serverDate,               // Текущая дата сервера
      };
  
      // Отправляем ответ
      res.json(response);
    } catch (error) {
      // Обработка ошибок
      res
        .status(500)
        .json({ error: `Ошибка при получении списка сезонов: ${error.message}` });
    }
  });

module.exports = seasonRouter;
