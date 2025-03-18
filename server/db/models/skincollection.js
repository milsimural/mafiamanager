'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SkinCollection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Skin}) {
      this.hasMany(Skin, {foreignKey:'collectionId', as: 'skin'});
    }
  }
  SkinCollection.init({
    name: DataTypes.STRING,
    picture: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'SkinCollection',
  });
  return SkinCollection;
};