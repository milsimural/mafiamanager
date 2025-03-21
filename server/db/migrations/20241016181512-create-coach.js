'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Coaches', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      playerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Players',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      effect: {
        type: Sequelize.STRING,
      },
      costcoins: {
        type: Sequelize.INTEGER,
      },
      costgems: {
        type: Sequelize.INTEGER,
      },
      costcoinsHistory: {
        type: Sequelize.STRING,
      },
      costgemsHistory: {
        type: Sequelize.STRING,
      },
      ismarket: {
        type: Sequelize.BOOLEAN,
      },
      salary: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Coaches');
  },
};
