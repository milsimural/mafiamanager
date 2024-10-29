'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      avatar: {
        type: Sequelize.STRING,
      },
      coins: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      gems: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      gomafiaId: {
        type: Sequelize.INTEGER,
        unique: true,
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      paidAccountGoMafia: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      pass: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        },
      passStart: {
        type: Sequelize.DATE,
      },
      passEnd: {
        type: Sequelize.DATE,
      },
      constructLeague: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      accountPower: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      draftLeague: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastLogin: {
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
