'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('MinicupParticipants', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      minicupid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Minicups',
          key: 'id',
        },
      },
      game: {
        type: Sequelize.INTEGER,
      },
      playerid: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id',
        },
      },
      place: {
        type: Sequelize.INTEGER,
      },
      role: {
        type: Sequelize.STRING,
      },
      points: {
        type: Sequelize.FLOAT,
      },
      bonuspoints: {
        type: Sequelize.FLOAT,
      },
      minuspoints: {
        type: Sequelize.FLOAT,
      },
      compenspoints: {
        type: Sequelize.FLOAT,
      },
      bestmove: {
        type: Sequelize.FLOAT,
      },
      firstkill: {
        type: Sequelize.INTEGER,
      },
      gameresult: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('MinicupParticipants');
  },
};
