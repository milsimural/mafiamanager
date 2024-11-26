'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'GiftConfigs',
      [
        {
          coins: JSON.stringify({
            first_place: 1000,
            second_place: 500,
            third_place: 250,
          }),
          gems: JSON.stringify({
            first_place: 100,
            second_place: 50,
            third_place: 25,
          }),
          items: JSON.stringify({
            first_place: [
              { id: 1, quantity: 5 },
              { id: 2, quantity: 3 },
            ],
            second_place: [
              { id: 3, quantity: 2 },
              { id: 4, quantity: 4 },
            ],
            third_place: [
              { id: 5, quantity: 1 },
              { id: 6, quantity: 5 },
            ],
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          coins: JSON.stringify({
            first_place: 1200,
            second_place: 600,
            third_place: 300,
          }),
          gems: JSON.stringify({
            first_place: 150,
            second_place: 75,
            third_place: 35,
          }),
          items: JSON.stringify({
            first_place: [
              { id: 7, quantity: 3 },
              { id: 8, quantity: 5 },
            ],
            second_place: [
              { id: 9, quantity: 6 },
              { id: 10, quantity: 3 },
            ],
            third_place: [
              { id: 11, quantity: 2 },
              { id: 12, quantity: 8 },
            ],
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          coins: JSON.stringify({
            first_place: 800,
            second_place: 400,
            third_place: 200,
          }),
          gems: JSON.stringify({
            first_place: 80,
            second_place: 40,
            third_place: 20,
          }),
          items: JSON.stringify({
            first_place: [
              { id: 13, quantity: 1 },
              { id: 14, quantity: 7 },
            ],
            second_place: [
              { id: 15, quantity: 3 },
              { id: 16, quantity: 9 },
            ],
            third_place: [
              { id: 17, quantity: 5 },
              { id: 18, quantity: 4 },
            ],
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          coins: JSON.stringify({
            first_place: 1500,
            second_place: 750,
            third_place: 375,
          }),
          gems: JSON.stringify({
            first_place: 200,
            second_place: 100,
            third_place: 50,
          }),
          items: JSON.stringify({
            first_place: [
              { id: 19, quantity: 6 },
              { id: 20, quantity: 3 },
            ],
            second_place: [
              { id: 21, quantity: 8 },
              { id: 22, quantity: 2 },
            ],
            third_place: [
              { id: 23, quantity: 7 },
              { id: 24, quantity: 1 },
            ],
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          coins: JSON.stringify({
            first_place: 2000,
            second_place: 1000,
            third_place: 500,
          }),
          gems: JSON.stringify({
            first_place: 300,
            second_place: 150,
            third_place: 75,
          }),
          items: JSON.stringify({
            first_place: [
              { id: 25, quantity: 2 },
              { id: 26, quantity: 8 },
            ],
            second_place: [
              { id: 27, quantity: 4 },
              { id: 28, quantity: 6 },
            ],
            third_place: [
              { id: 29, quantity: 3 },
              { id: 30, quantity: 5 },
            ],
          }),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('GiftConfigs', null, {});
  },
};
