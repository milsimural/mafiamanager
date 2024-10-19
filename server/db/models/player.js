'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Player.init({
    nickname: DataTypes.STRING,
    picture: DataTypes.STRING,
    rating: DataTypes.INTEGER,
    costcoins: DataTypes.INTEGER,
    costgems: DataTypes.INTEGER,
    bio: DataTypes.TEXT,
    ismarket: DataTypes.BOOLEAN,
    clubid: DataTypes.INTEGER,
    skills: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Player',
  });
  return Player;
};