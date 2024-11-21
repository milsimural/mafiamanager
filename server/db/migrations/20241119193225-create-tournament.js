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
