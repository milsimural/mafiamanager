'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Constructs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      tournamentsid: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Tournaments',
          key: 'id',
        },
      },
      leader: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id',
        },
      },
      mate1: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id',
        },
      },
      mate2: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id',
        },
      },
      mate3: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id',
        },
      },
      mate4: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id',
        },
      },
      scores: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable('Constructs');
  },
};
