'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Tournaments', [
      {
        name: 'Autumn Cup 2024',
        gomafiaId: 1,
        date_start: '2024-11-01',
        date_end: '2024-11-05',
        cityId: 1,
        countryId: 1,
        status: 'scheduled',
        main_referee_id: 1,
        star: 3,
        type: '',
        projected_count_of_participants: 50,
        isReady: true,
        giftConfigId: 1,
        rosterFinish: false,
        x: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Winter Classic',
        gomafiaId: 2,
        date_start: '2024-12-10',
        date_end: '2024-12-15',
        cityId: 1,
        countryId: 1,
        status: 'scheduled',
        main_referee_id: 2,
        star: 4,
        type: '',
        projected_count_of_participants: 30,
        isReady: false,
        giftConfigId: 2,
        rosterFinish: false,
        x: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Tournaments', null, {});
  },
};
