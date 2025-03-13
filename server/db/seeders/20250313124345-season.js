'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Seasons',
      [
        {
          title: "Прошлый сезон",
          start: new Date(2024, 0, 1),
          end: new Date(2024, 11, 31),
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Время Титанов",
          start: new Date(2025, 0, 1),
          end: new Date(2025, 7, 4),
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "Следующий сезон",
          start: new Date(2025, 7, 5),
          end: new Date(2025, 11, 15),
          picture: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Seasons', null, {});
  },
};

