'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MinicupParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  MinicupParticipant.init({
    minicupid: DataTypes.INTEGER,
    game: DataTypes.INTEGER,
    playerid: DataTypes.INTEGER,
    place: DataTypes.INTEGER,
    role: DataTypes.STRING,
    points: DataTypes.FLOAT,
    bonuspoints: DataTypes.FLOAT,
    minuspoints: DataTypes.FLOAT,
    compenspoints: DataTypes.FLOAT,
    bestmove: DataTypes.FLOAT,
    firstkill: DataTypes.INTEGER,
    gameresult: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MinicupParticipant',
  });
  return MinicupParticipant;
};