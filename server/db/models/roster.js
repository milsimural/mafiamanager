'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Roster extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Tournament}) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Tournament, { foreignKey: 'tournamentId' });
    }
  }
  Roster.init({
    userId: DataTypes.INTEGER,
    tournamentId: DataTypes.INTEGER,
    rosterPlayers: DataTypes.STRING,
    teamPlayers: DataTypes.STRING,
    isClose: DataTypes.BOOLEAN,
    isOver: DataTypes.BOOLEAN,
    profitCoins: DataTypes.INTEGER,
    profitGems: DataTypes.INTEGER,
    profitItems: DataTypes.STRING,
    place: DataTypes.INTEGER,
    perpCount: DataTypes.INTEGER,
    averagePlace: DataTypes.FLOAT,
    isTakeProfit: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Roster',
  });
  return Roster;
};