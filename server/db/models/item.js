'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Transaction }) {
      this.hasMany(Transaction, { foreignKey: 'itemId' });
    }
  }
  Item.init(
    {
      type: DataTypes.STRING,
      costcoins: DataTypes.INTEGER,
      costgems: DataTypes.INTEGER,
      name: DataTypes.STRING,
      effect: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Item',
    },
  );
  return Item;
};
