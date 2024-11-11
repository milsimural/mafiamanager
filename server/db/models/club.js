'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Player}) {
      this.hasMany(Player, { foreignKey: 'clubId' });
    }
  }
  Club.init(
    {
      name: DataTypes.STRING,
      city: DataTypes.STRING,
      country: DataTypes.STRING,
      borndate: DataTypes.DATEONLY,
      logo: DataTypes.STRING,
      playersCount: DataTypes.INTEGER,
      avrElo: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Club',
    },
  );
  return Club;
};
