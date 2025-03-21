'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Season extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Season.init(
    {
      title: DataTypes.STRING,
      start: DataTypes.DATE,
      end: DataTypes.DATE,
      picturePC: DataTypes.STRING,
      pictureMB: DataTypes.STRING,
      pictureShort: DataTypes.STRING,
      giftConfigs: DataTypes.TEXT, // Массив конфигов подарков с 1 по 100 место
      endRatingUserIds: DataTypes.TEXT, // Массив id пользователей с первого по последнее место кроме юзеров с ноль монет за сезон
    },
    {
      sequelize,
      modelName: 'Season',
    },
  );
  return Season;
};
