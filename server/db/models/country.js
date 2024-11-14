'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Player, City, Club}) {
      this.hasMany(Player, { foreignKey: 'countryId' });
      this.hasMany(City, { foreignKey: 'countryId' });
      this.hasMany(Club, { foreignKey: 'country' });
    }
  }
  Country.init({
    name: DataTypes.STRING,
    icon: DataTypes.STRING,
    short: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};