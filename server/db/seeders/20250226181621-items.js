'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Items',
      [
        {
          type: 'Ускоритель тренировки',
          costgems: 3,
          name: 'Ускорение 1 минута',
          effect: 'Снижает время необходимое на тренировку на 1 минуту',
          picture: '',
          actionName: 'addTime',
          timeAdd: 1,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 40,
          name: 'Ускорение 15 минут',
          effect: 'Снижает время необходимое на тренировку на 15 минут',
          picture: '',
          actionName: 'addTime',
          timeAdd: 15,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 120,
          name: 'Ускорение 60 минут',
          effect: 'Снижает время необходимое на тренировку на 1 час',
          picture: '',
          actionName: 'addTime',
          timeAdd: 60,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 300,
          name: 'Ускорение 3 часа',
          effect: 'Снижает время необходимое на тренировку на 3 часа',
          picture: '',
          actionName: 'addTime',
          timeAdd: 180,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 600,
          name: 'Ускорение 8 часов',
          effect: 'Снижает время необходимое на тренировку на 8 часов',
          picture: '',
          actionName: 'addTime',
          timeAdd: 480,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 1000,
          name: 'Ускорение 15 часов',
          effect: 'Снижает время необходимое на тренировку на 15 часов',
          picture: '',
          actionName: 'addTime',
          timeAdd: 720,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 1500,
          name: 'Ускорение 24 часа',
          effect: 'Снижает время необходимое на тренировку на 24 часа',
          picture: '',
          actionName: 'addTime',
          timeAdd: 1440,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 4400,
          name: 'Ускорение 3 дня',
          effect: 'Снижает время необходимое на тренировку на 3 дня',
          picture: '',
          actionName: 'addTime',
          timeAdd: 4320,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 10000,
          name: 'Ускорение 7 дней',
          effect: 'Снижает время необходимое на тренировку на 7 дней',
          picture: '',
          actionName: 'addTime',
          timeAdd: 10080,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Ускоритель тренировки',
          costgems: 40000,
          name: 'Ускорение 30 дней',
          effect: 'Снижает время необходимое на тренировку на 30 дней',
          picture: '',
          actionName: 'addTime',
          timeAdd: 43200,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
        {
          type: 'Пробная карта',
          costgems: 10,
          name: 'Пробная карта Градиент',
          effect: 'Вы получаете в ваше распоряжение спортсмена на 3 дня',
          picture: '',
          actionName: 'rentPlayer',
          duration: 1440,
          playerId: 1,
          createdAt: new Date(),
        updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Item', null, {});
  },
};
