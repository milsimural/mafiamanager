'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Coach extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Player, Hire, User }) {
      this.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
      this.belongsToMany(User, { through: Hire, foreignKey: 'coachId', otherKey: 'userId', as: 'users' });
    }
  }
  Coach.init(
    {
      playerId: DataTypes.INTEGER,
      effect: DataTypes.STRING,
      costcoins: DataTypes.INTEGER,
      costcoinsHistory: DataTypes.STRING,
      costgems: DataTypes.INTEGER,
      costgemsHistory: DataTypes.STRING,
      ismarket: DataTypes.BOOLEAN,
      salary: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Coach',
    },
  );
  return Coach;
};
