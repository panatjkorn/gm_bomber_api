'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class bomb_panel extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  bomb_panel.init({
    panel_name: DataTypes.STRING,
    total_bomb: DataTypes.INTEGER,
    panel_default: DataTypes.JSON,
    panel_default_ex: DataTypes.JSON,
    open_panel: DataTypes.JSON,
    open_panel_default: DataTypes.JSON,
    is_won: DataTypes.BOOLEAN,
    is_playing: DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'bomb_panel',
  });
  return bomb_panel;
};