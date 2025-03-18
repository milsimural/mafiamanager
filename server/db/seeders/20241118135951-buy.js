'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Teams',
      [
        {
          ownerid: 1,
          playerid: 1,
          level: 0,
          exp: 0,
          tournaments: 0,
          pointsgain: 0,
          coinsprofit: 0,
          gemsprofit: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerid: 1,
          playerid: 2,
          level: 0,
          exp: 0,
          tournaments: 0,
          pointsgain: 0,
          coinsprofit: 0,
          gemsprofit: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerid: 2,
          playerid: 1,
          level: 0,
          exp: 0,
          tournaments: 0,
          pointsgain: 0,
          coinsprofit: 0,
          gemsprofit: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerid: 2,
          playerid: 4,
          level: 0,
          exp: 0,
          tournaments: 0,
          pointsgain: 0,
          coinsprofit: 0,
          gemsprofit: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerid: 2,
          playerid: 3,
          level: 0,
          exp: 0,
          tournaments: 0,
          pointsgain: 0,
          coinsprofit: 0,
          gemsprofit: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
    await queryInterface.bulkInsert(
      'Transactions',
      [
        {
          userId: 1,
          type: 'buyPlayer',
          playerId: 1,
          amount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 1,
          type: 'buyPlayer',
          playerId: 2,
          amount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          type: 'buyPlayer',
          playerId: 1,
          amount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          type: 'buyPlayer',
          playerId: 4,
          amount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          type: 'buyPlayer',
          playerId: 3,
          amount: 1000,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Teams', null, {});
    await queryInterface.bulkDelete('Transactions', null, {});
  },
};
