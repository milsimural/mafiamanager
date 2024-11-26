'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Rosters', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      tournamentId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Tournaments',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      rosterPlayers: {
        type: Sequelize.STRING,
      },
      teamPlayers: {
        type: Sequelize.STRING,
      },
      isClose: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isOver: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      profitCoins: {
        type: Sequelize.INTEGER,
      },
      profitGems: {
        type: Sequelize.INTEGER,
      },
      profitItems: {
        type: Sequelize.STRING,
      },
      place: {
        type: Sequelize.INTEGER,
      },
      perpCount: {
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
    await queryInterface.dropTable('Rosters');
  },
};
