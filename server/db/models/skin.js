'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({SkinCollection, Player}) {
      this.belongsTo(SkinCollection, {foreignKey: 'collectionId', as: 'collection'});
      this.belongsTo(Player, {foreignKey: 'playerId', as: 'player'});
    }
  }
  Skin.init({
    name: DataTypes.STRING,
    playerId: DataTypes.INTEGER,
    picture: DataTypes.STRING,
    collectionId: DataTypes.INTEGER,
    costfragments: DataTypes.INTEGER,
    costgems: DataTypes.INTEGER,
    skills: DataTypes.STRING,
    trainBonus: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Skin',
  });
  return Skin;
};