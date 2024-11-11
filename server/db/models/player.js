'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Club }) {
      this.belongsTo(Club, { foreignKey: 'clubId' });
    }
  }
  Player.init(
    {
      nickname: DataTypes.STRING,
      picture: DataTypes.STRING,
      stars: DataTypes.INTEGER,
      costcoins: DataTypes.INTEGER,
      costgems: DataTypes.INTEGER,
      bio: DataTypes.TEXT,
      ismarket: DataTypes.BOOLEAN,
      clubId: DataTypes.INTEGER,
      skills: DataTypes.STRING,
      elo: DataTypes.INTEGER,
      transfers: DataTypes.INTEGER,
      dismissals: DataTypes.INTEGER,
      gomafiaId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Player',
    },
  );
  return Player;
};
