'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Skins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      playerId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Players',
          key: 'id',
        }
      },
      picture: {
        type: Sequelize.STRING
      },
      collectionId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'SkinCollections',
          references: 'id',
        }
      },
      costfragments: {
        type: Sequelize.INTEGER
      },
      costgems: {
        type: Sequelize.INTEGER
      },
      skills: {
        type: Sequelize.STRING
      },
      trainBonus: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Skins');
  }
};