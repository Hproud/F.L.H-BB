'use strict';
const {
  Model
} = require('sequelize');
const { Sequelize } = require('.');
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
          foreignKey: 'imageableId',
          as: 'spotImages',
          constraints:false
        }
      )

      Image.belongsTo(
        models.Review,{
          foreignKey: 'imageableId',
          constraints:false
        }
      )
    }
  }
  Image.init({
    imageableType: {
type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING,
      allowNull:false
    },
      preview: {
        type: DataTypes.BOOLEAN,
        defaultValue:false
      }
    }


  , {
    sequelize,
    modelName: 'Image',
    defaultScope:{
      attributes:{
        include:['id','url','preview'],
        exclude: ['imageableId','imageableType','createdAt','updatedAt']
      }
    }
  }
  );
  return Image;
};
