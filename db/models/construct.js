'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Construct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Construct.init({
    userid: DataTypes.INTEGER,
    tournamentsid: DataTypes.INTEGER,
    leader: DataTypes.INTEGER,
    mate1: DataTypes.INTEGER,
    mate2: DataTypes.INTEGER,
    mate3: DataTypes.INTEGER,
    mate4: DataTypes.INTEGER,
    scores: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Construct',
  });
  return Construct;
};