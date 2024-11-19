'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class City extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Country, Tournament }) {
      this.belongsTo(Country, { foreignKey: 'countryId' });
      this.hasMany(Tournament, { foreignKey: 'cityId' });
    }
  }
  City.init(
    {
      name: DataTypes.STRING,
      countryId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'City',
    },
  );
  return City;
};
