'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
   await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        password: await bcrypt.hash('123', 10),
        coins: 10000,
        gems: 10,
        email: 'qwerty@revanta.ru',
        isAdmin: true,
        paidAccountGoMafia: false,
        passEnd: new Date(),
        accountPower: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User',
        password: await bcrypt.hash('123', 10),
        coins: 10000,
        gems: 10,
        email: 'reinekelis@mail.ru',
        isAdmin: false,
        paidAccountGoMafia: false,
        passEnd: new Date(),
        accountPower: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
