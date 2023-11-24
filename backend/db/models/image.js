'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Image.belongsTo(
        models.Spot,{
          foreignKey: 'id',
          onDelete: 'CASCADE',
          hooks: true
        }
      ),

      Image.belongsTo(
        models.Review,{
          foreignKey: 'id',
          onDelete: 'CASCADE',
          hooks: true
        }
      )
    }
  }
  Image.init({
    imageableId: {
      type: DataTypes.INTEGER,
      allowNull:false

    },
    imageableType: DataTypes.STRING,
    url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};