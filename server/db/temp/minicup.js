'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Minicup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Minicup.init({
    name: DataTypes.STRING,
    cityid: DataTypes.INTEGER,
    clubid: DataTypes.INTEGER,
    userid: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    gembet: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Minicup',
  });
  return Minicup;
};