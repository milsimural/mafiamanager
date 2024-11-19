'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tournaments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      gomafiaId: {
        type: Sequelize.INTEGER,
      },
      date_start: {
        type: Sequelize.DATEONLY,
      },
      date_end: {
        type: Sequelize.DATEONLY,
      },
      cityId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cities',
          key: 'id',
        },
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Tournaments');
  },
};
