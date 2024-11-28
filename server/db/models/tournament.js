'use strict';

const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tournament extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ City, GiftConfig, User, Roster }) {
      this.belongsTo(City, { foreignKey: 'cityId' });
      this.belongsTo(GiftConfig, { foreignKey: 'giftConfigId' });
      this.belongsToMany(User, { through: Roster, foreignKey: 'tournamentId' });
      this.hasMany(Roster, { foreignKey: 'tournamentId' });
    }
  }
  Tournament.init(
    {
      name: DataTypes.STRING,
      gomafiaId: DataTypes.INTEGER,
      date_start: DataTypes.DATEONLY,
      date_end: DataTypes.DATEONLY,
      cityId: DataTypes.INTEGER,
      countryId: DataTypes.INTEGER,
      status: DataTypes.STRING,
      main_referee_id: DataTypes.INTEGER,
      star: DataTypes.INTEGER,
      type: DataTypes.STRING,
      projected_count_of_participants: DataTypes.INTEGER,
      isReady: DataTypes.BOOLEAN,
      playersList: DataTypes.STRING,
      gamesTables: DataTypes.TEXT,
      resultTable: DataTypes.TEXT,
      giftConfigId: DataTypes.INTEGER,
      rosterFinish: DataTypes.BOOLEAN, 
    },
    {
      sequelize,
      modelName: 'Tournament',
    },
  );
  return Tournament;
};
