'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hire extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Coach }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsTo(Coach, { foreignKey: 'coachId', as: 'coach' });
    }
  }
  Hire.init(
    {
      userId: DataTypes.INTEGER,
      coachId: DataTypes.INTEGER,
      isActive: DataTypes.BOOLEAN,
      trainSlotOne: DataTypes.INTEGER,
      trainSlotTwo: DataTypes.INTEGER,
      trainSlotThree: DataTypes.INTEGER,
      trainSlotFour: DataTypes.INTEGER,
      trainSlotFive: DataTypes.INTEGER,
      isSlotOneOpen: DataTypes.BOOLEAN,
      isSlotTwoOpen: DataTypes.BOOLEAN,
      isSlotThreeOpen: DataTypes.BOOLEAN,
      isSlotFourOpen: DataTypes.BOOLEAN,
      isSlotFiveOpen: DataTypes.BOOLEAN,
      paidTill: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: 'Hire',
    },
  );
  return Hire;
};
