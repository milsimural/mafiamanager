'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class GiftConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Tournament }) {
      this.hasMany(Tournament, { foreignKey: 'giftConfigId' });
    }
  }
  GiftConfig.init(
    {
      coins: DataTypes.STRING,
      gems: DataTypes.STRING,
      items: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'GiftConfig',
    },
  );
  return GiftConfig;
};
