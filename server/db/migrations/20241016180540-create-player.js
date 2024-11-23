'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Players', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nickname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      picture: {
        type: Sequelize.STRING,
      },
      stars: {
        type: Sequelize.INTEGER,
      },
      power: {
        type: Sequelize.INTEGER,
      },
      powerHistory: {
        type: Sequelize.STRING,
      },
      costcoinsHistory: {
        type: Sequelize.STRING,
      },
      costgemsHistory: {
        type: Sequelize.STRING,
      },
      costcoins: {
        type: Sequelize.INTEGER,
      },
      costgems: {
        type: Sequelize.INTEGER,
      },
      bio: {
        type: Sequelize.TEXT,
      },
      ismarket: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      clubId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Clubs',
          key: 'id',
        },
        allowNull: true,
        onDelete: 'SET NULL',
      },
      skills: {
        type: Sequelize.STRING,
      },
      elo: {
        type: Sequelize.INTEGER,
      },
      transfers: {
        type: Sequelize.INTEGER,
      },
      dismissals: {
        type: Sequelize.INTEGER,
      },
      gomafiaId: {
        type: Sequelize.INTEGER,
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
      cityId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Cities',
          key: 'id',
        },
        onDelete: 'SET NULL',
        allowNull: true,
      },
      isOpen: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
  async down(queryInterface) {
    await queryInterface.dropTable('Players');
  },
};
