'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'ItemInstances',
      [
        {
          itemId: 1,
          userId: 1,
          isActivated: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          itemId: 2,
          userId: 1,
          isActivated: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ItemInstances', null, {});
  },
};
