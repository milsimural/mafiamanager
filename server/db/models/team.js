'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({User, Player}) {
      this.belongsTo(User, { foreignKey: 'ownerid', as: 'owner' });
      this.belongsTo(Player, { foreignKey: 'playerid', as: 'player' });
    }
  }
  Team.init(
    {
      ownerid: DataTypes.INTEGER,
      playerid: DataTypes.INTEGER,
      level: DataTypes.INTEGER,
      exp: DataTypes.INTEGER,
      tournaments: DataTypes.INTEGER,
      pointsgain: DataTypes.INTEGER,
      coinsprofit: DataTypes.INTEGER,
      gemsprofit: DataTypes.INTEGER,
      stats: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Team',
    },
  );
  return Team;
};
