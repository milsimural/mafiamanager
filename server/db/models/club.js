'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Club extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Player, City, Country}) {
      this.hasMany(Player, { foreignKey: 'clubId' });
      this.belongsTo(City, { foreignKey: 'cityId' });
      this.belongsTo(Country, { foreignKey: 'countryId' });
    }
  }
  Club.init(
    {
      name: DataTypes.STRING,
      cityId: DataTypes.INTEGER,
      countryId: DataTypes.INTEGER,
      borndate: DataTypes.DATEONLY,
      logo: DataTypes.STRING,
      playersCount: DataTypes.INTEGER,
      avrElo: DataTypes.INTEGER,
      ticker: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Club',
    },
  );
  return Club;
};
