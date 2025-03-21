'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'GiftConfigs',
      [
        {
          name: 'small',
          coins: [1200, 800, 500, 300, 200, 0, 0, 0, 0, 0], // Сумма: 3000 coins
          gems: [120, 80, 50, 30, 20, 0, 0, 0, 0, 0],       // Сумма: 300 gems
          randomItems: [30, 20, 10, 0, 0, 0, 0, 0, 0, 0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'standart',
          coins: [6000, 4000, 2500, 1500, 1000, 500, 0, 0, 0, 0], // Сумма: 15000 coins
          gems: [600, 400, 250, 150, 100, 0, 0, 0, 0, 0],         // Сумма: 1500 gems
          randomItems: [50, 40, 30, 20, 10, 0, 0, 0, 0, 0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'big',
          coins: [14000, 9000, 6000, 3500, 2000, 1000, 500, 0, 0, 0], // Сумма: 35000 coins
          gems: [1400, 900, 600, 350, 200, 100, 50, 0, 0, 0],         // Сумма: 3500 gems
          randomItems: [80, 60, 40, 30, 20, 10, 0, 0, 0, 0],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('GiftConfigs', null, {});
  },
};
