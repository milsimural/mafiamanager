'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Club, City, Country, User, Team, Transaction, Coach }) {
      this.belongsTo(Club, { foreignKey: 'clubId', as: 'Club' });
      this.belongsTo(City, { foreignKey: 'cityId' });
      this.belongsTo(Country, { foreignKey: 'countryId' });
      this.belongsToMany(User, {
        through: Team,
        foreignKey: 'playerid',
        otherKey: 'ownerid',
        as: 'users',
      });
      this.hasMany(Transaction, { foreignKey: 'playerId' });
      this.hasOne(Coach, { foreignKey: 'playerId', as: 'coach' });
    }
  }
  Player.init(
    {
      nickname: DataTypes.STRING,
      winrate: DataTypes.INTEGER,
      picture: DataTypes.STRING,
      stars: DataTypes.INTEGER,
      power: DataTypes.INTEGER,
      powerHistory: DataTypes.STRING,
      costcoins: DataTypes.INTEGER,
      costcoinsHistory: DataTypes.STRING,
      costgems: DataTypes.INTEGER,
      costgemsHistory: DataTypes.STRING,
      bio: DataTypes.TEXT,
      ismarket: DataTypes.BOOLEAN,
      clubId: DataTypes.INTEGER,
      skills: DataTypes.STRING,
      elo: DataTypes.FLOAT,
      transfers: DataTypes.INTEGER,
      dismissals: DataTypes.INTEGER,
      gomafiaId: DataTypes.INTEGER,
      countryId: DataTypes.INTEGER,
      cityId: DataTypes.INTEGER,
      isOpen: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: 'Player',
    },
  );
  return Player;
};
