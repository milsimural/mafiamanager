'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clubs', {
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
      borndate: {
        type: Sequelize.DATEONLY,
      },
      logo: {
        type: Sequelize.STRING,
      },
      icon: {
        type: Sequelize.STRING,
      },
      playersCount: {
        type: Sequelize.INTEGER,
      },
      avrElo: {
        type: Sequelize.INTEGER,
      },
      ticker: {
        type: Sequelize.STRING,
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable('Clubs');
  },
};
