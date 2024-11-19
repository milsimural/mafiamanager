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
    static associate({City}) {
      this.belongsTo(City, { foreignKey: 'cityId' });
    }
  }
  Tournament.init({
    name: DataTypes.STRING,
    gomafiaId: DataTypes.INTEGER,
    date_start: DataTypes.DATEONLY,
    date_end: DataTypes.DATEONLY,
    cityId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tournament',
  });
  return Tournament;
};