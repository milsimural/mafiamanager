'use strict';

const bcrypt = require('bcrypt');
const process = require('process');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin',
        password: await bcrypt.hash(process.env.PASS, 10),
        coins: 18000,
        gems: 100,
        email: 'qwerty@revanta.ru',
        isAdmin: true,
        isModerator: false,
        paidAccountGoMafia: false,
        passEnd: new Date(),
        accountPower: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Moderator',
        password: await bcrypt.hash(process.env.PASS, 10),
        coins: 18000,
        gems: 100,
        email: 'reinekelis@mail.ru',
        isAdmin: false,
        isModerator: true,
        paidAccountGoMafia: false,
        passEnd: new Date(),
        accountPower: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'User',
        password: await bcrypt.hash(process.env.PASS, 10),
        coins: 18000,
        gems: 100,
        email: 'trafic1ru@gmail.com',
        isAdmin: false,
        isModerator: false,
        paidAccountGoMafia: false,
        passEnd: new Date(),
        accountPower: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('Countries', [
      {
        name: 'Россия',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Белоруссия',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('Cities', [
      { name: 'Москва', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Санкт-Петербург',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Новосибирск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Екатеринбург',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Нижний Новгород',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Казань', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Челябинск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Омск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Самара', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Ростов-на-Дону',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Уфа', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Красноярск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Пермь', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Воронеж', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Волгоград', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Краснодар', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Саратов', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Тюмень', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ижевск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Барнаул', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ульяновск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Владивосток', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ярославль', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Иркутск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Томск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Кемерово', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Тула', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Астрахань', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Липецк', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Тверь', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Курск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Курган', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Смоленск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Калуга', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Сочи', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Белгород', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Архангельск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Сургут', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Владимир', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Чита', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Киров', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Рязань', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Тамбов', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Грозный', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Якутск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Брянск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Стерлитамак', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Оренбург', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Пенза', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Махачкала', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Набережные Челны',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Люберцы', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Калининград', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Таганрог', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Норильск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Иваново', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Братск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Курск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Чебоксары', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Нижневартовск',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Курган', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Вологда', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Кострома', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Мурманск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Севастополь', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Петропавловск-Камчатский',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Магнитогорск',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Тольятти', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Хабаровск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Новокузнецк', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Саранск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Благовещенск',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Комсомольск-на-Амуре',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Старый Оскол',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Рыбинск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Сыктывкар', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Балашиха', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Армавир', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Миасс', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Псков', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Новороссийск',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Серпухов', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Петрозаводск',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Череповец', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Орск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Тюмень', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Волжский', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Элиста', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Пятигорск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Южно-Сахалинск',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Внедорожник', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Набережные Челны',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Салават', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      {
        name: 'Нижний Тагил',
        countryId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { name: 'Сургут', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Домодедово', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Батайск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Златоуст', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Ангарск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Дзержинск', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
      { name: 'Шахты', countryId: 1, createdAt: new Date(), updatedAt: new Date() },
    ]);
    await queryInterface.bulkInsert('Clubs', [
      {
        id: 196,
        name: 'TITAN',
        cityId: 1,
        countryId: 1,
        ticker: 'TITAN',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 32,
        name: 'Red Elvis Mafia',
        cityId: 1,
        countryId: 1,
        ticker: 'RE',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 92,
        name: 'Инкогнито',
        cityId: 1,
        countryId: 1,
        ticker: 'INK',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 99,
        name: 'Domus',
        cityId: 1,
        countryId: 1,
        ticker: 'DMS',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 129,
        name: 'Red Black Family',
        cityId: 1,
        countryId: 1,
        ticker: 'RBF',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 49,
        name: 'Prospects mafia',
        cityId: 1,
        countryId: 1,
        ticker: 'PM',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 201,
        name: 'Легион',
        cityId: 1,
        countryId: 1,
        ticker: 'LEG',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 286,
        name: 'HEADSHOT Москва',
        cityId: 1,
        countryId: 1,
        ticker: 'HSm',
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
