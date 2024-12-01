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
        onDelete: 'SET NULL',
        allowNull: true,
      },
      countryId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Countries',
          key: 'id',
        },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      status: {
        type: Sequelize.STRING,
      },
      main_referee_id: {
        type: Sequelize.INTEGER,
      },
      star: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      projected_count_of_participants: {
        type: Sequelize.INTEGER,
      },
      isReady: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      playersList: {
        type: Sequelize.TEXT,
      },
      gamesTables: {
        type: Sequelize.TEXT,
      },
      resultTable: {
        type: Sequelize.TEXT,
      },
      giftConfigId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'GiftConfigs',
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
      },
      rosterFinish: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      rawData: {
        type: Sequelize.TEXT,
      },
      x: {
        type: Sequelize.INTEGER,
        defaultValue: 3,
        allowNull: false,
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
