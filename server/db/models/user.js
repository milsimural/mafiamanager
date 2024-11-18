'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Player, Team }) {
      this.belongsToMany(Player, { through: Team });
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      frame: DataTypes.STRING,
      coins: DataTypes.INTEGER,
      gems: DataTypes.INTEGER,
      email: DataTypes.STRING,
      gomafiaId: DataTypes.INTEGER,
      isAdmin: DataTypes.BOOLEAN,
      isModerator: DataTypes.BOOLEAN,
      isBanned: DataTypes.BOOLEAN,
      paidAccountGoMafia: DataTypes.BOOLEAN,
      passEnd: DataTypes.DATE,
      accountPower: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};