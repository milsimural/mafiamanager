'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Seasons',
      [
        {
          title: 'Время Титанов',
          start: new Date(2025, 0, 1),
          end: new Date(2025, 7, 4),
          picturePC: 'main.jpg',
          pictureMB: 'main-mob.jpg',
          pictureShort: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: 'Битва на волге',
          start: new Date(2025, 7, 5),
          end: new Date(2025, 11, 15),
          picturePC: null,
          pictureMB: null,
          pictureShort: null,
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
