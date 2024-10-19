'use strict';

const { Message } = require('../models');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Message.bulkCreate(
      [
        { text: 'Всем привет', signature: 'BigBoss' },
        { text: 'Привет', signature: 'Васян' },
        { text: 'Как дела?', signature: 'Петро' },
        { text: 'Нормально', signature: 'Васян' },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
