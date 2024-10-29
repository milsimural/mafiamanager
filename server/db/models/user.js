'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      password: DataTypes.STRING,
      avatar: DataTypes.STRING,
      coins: DataTypes.INTEGER,
      gems: DataTypes.INTEGER,
      email: DataTypes.STRING,
      gomafiaId: DataTypes.INTEGER,
      isAdmin: DataTypes.BOOLEAN,
      paidAccountGoMafia: DataTypes.BOOLEAN,
      pass: DataTypes.BOOLEAN,
      passStart: DataTypes.DATE,
      passEnd: DataTypes.DATE,
      constructLeague: DataTypes.INTEGER,
      accountPower: DataTypes.FLOAT,
      draftLeague: DataTypes.INTEGER,
      lastLogin: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'User',
    },
  );
  return User;
};
