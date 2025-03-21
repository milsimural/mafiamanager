'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ownerid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      playerid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Players',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      exp: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      tournaments: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      pointsgain: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      coinsprofit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gemsprofit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      stats: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expiredAt: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable('Teams');
  },
};
