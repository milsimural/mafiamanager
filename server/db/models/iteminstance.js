'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ItemInstance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Item }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'owner' });
      this.belongsTo(Item, { foreignKey: 'itemId', as: 'prototype' });
    }
  }
  ItemInstance.init(
    {
      itemId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      isActivated: DataTypes.BOOLEAN,
      isBlocked: DataTypes.BOOLEAN,
      activationStart: DataTypes.DATE,
      expiredAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'ItemInstance',
    },
  );
  return ItemInstance;
};
