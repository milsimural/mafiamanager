'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Player, Item }) {
      this.belongsTo(User, { foreignKey: 'userId' });
      this.belongsTo(Player, { foreignKey: 'playerId' });
      this.belongsTo(Item, { foreignKey: 'itemId' });
    }
  }
  Transaction.init(
    {
      userId: DataTypes.INTEGER,
      type: DataTypes.STRING,
      playerId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      itemId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Transaction',
    },
  );
  return Transaction;
};
