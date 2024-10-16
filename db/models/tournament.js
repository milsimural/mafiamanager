'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tournament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tournament.init({
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    federationid: DataTypes.INTEGER,
    cityid: DataTypes.INTEGER,
    maxplayers: DataTypes.INTEGER,
    datestart: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Tournament',
  });
  return Tournament;
};