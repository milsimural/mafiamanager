'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Transaction, Player, ItemInstance }) {
      this.hasMany(Transaction, { foreignKey: 'itemId' });
      this.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
      this.hasMany(ItemInstance, { foreignKey: 'itemId', as: 'itemInstances' });
    }
  }
  Item.init(
    {
      type: DataTypes.STRING,
      costcoins: DataTypes.INTEGER,
      costgems: DataTypes.INTEGER,
      name: DataTypes.STRING,
      effect: DataTypes.STRING,
      picture: DataTypes.STRING,
      actionName: DataTypes.STRING,
      timeAdd: DataTypes.INTEGER,
      duration: DataTypes.INTEGER,
      playerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Item',
    },
  );
  return Item;
};
