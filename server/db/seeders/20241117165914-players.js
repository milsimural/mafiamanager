'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Players',
      [
        {
          nickname: 'Варабей',
          picture: 'base.jpg',
          stars: 1,
          power: 39,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 8,
          gomafiaId: 6928,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Попс',
          picture: 'base.jpg',
          stars: 1,
          power: 58,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 8,
          gomafiaId: 6417,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Клюква',
          picture: 'base.jpg',
          stars: 2,
          power: 50,
          costcoins: 2000,
          costgems: 899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 4269,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Бэтмен',
          picture: 'base.jpg',
          stars: 1,
          power: 46,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 8,
          gomafiaId: 1929,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Berlioz',
          picture: 'base.jpg',
          stars: 1,
          power: 37,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 8,
          gomafiaId: 1672,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'LeBron',
          picture: 'base.jpg',
          stars: 3,
          power: 74,
          costcoins: 4000,
          costgems: 1899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 1350,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Phara',
          picture: 'base.jpg',
          stars: 3,
          power: 64,
          costcoins: 4000,
          costgems: 1899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 576,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Ля-Ля',
          picture: 'base.jpg',
          stars: 1,
          power: 58,
          costcoins: 2000,
          costgems: 899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 284,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Стрелец',
          picture: 'base.jpg',
          stars: 1,
          power: 53,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 8,
          gomafiaId: 249,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Hanna Montana',
          picture: 'base.jpg',
          stars: 1,
          power: 53,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 8,
          gomafiaId: 149,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Гаечка',
          picture: 'base.jpg',
          stars: 3,
          power: 62,
          costcoins: 4000,
          costgems: 1899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 23,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'NaLabuteNAX',
          picture: 'base.jpg',
          stars: 1,
          power: 51,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 8,
          gomafiaId: 1180,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Кэри',
          picture: 'base.jpg',
          stars: 2,
          power: 56,
          costcoins: 2000,
          costgems: 899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 775,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'rdrk',
          picture: 'base.jpg',
          stars: 3,
          power: 54,
          costcoins: 4000,
          costgems: 1899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 889,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Ривер',
          picture: 'base.jpg',
          stars: 2,
          power: 58,
          costcoins: 2000,
          costgems: 899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 2008,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'ARES',
          picture: 'base.jpg',
          stars: 2,
          power: 56,
          costcoins: 2000,
          costgems: 899,
          ismarket: true,
          clubId: 8,
          gomafiaId: 1349,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'ИхтиАндр',
          picture: 'base.jpg',
          stars: 1,
          power: 47,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 6625,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Булыжник',
          picture: 'base.jpg',
          stars: 1,
          power: 58,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 6438,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Асмодея',
          picture: 'base.jpg',
          stars: 1,
          power: 52,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 6428,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Пуля',
          picture: 'base.jpg',
          stars: 1,
          power: 45,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 6427,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Лотсо',
          picture: 'base.jpg',
          stars: 1,
          power: 51,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 4514,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Снорк',
          picture: 'base.jpg',
          stars: 1,
          power: 30,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 1106,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Провокация.',
          picture: 'base.jpg',
          stars: 1,
          power: 57,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 5448,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'Инструктор на порше',
          picture: 'base.jpg',
          stars: 1,
          power: 63,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 5146,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nickname: 'фederal',
          picture: 'base.jpg',
          stars: 1,
          power: 56,
          costcoins: 1000,
          costgems: 499,
          ismarket: true,
          clubId: 13,
          gomafiaId: 5240,
          countryId: 1,
          cityId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Players', null, {});
  },
};
