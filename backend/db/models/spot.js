'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(
        models.User,{
          foreignKey: 'ownerId'
        }
      ),

      Spot.hasMany(
        models.Review
      ),

      Spot.hasMany(
        models.Image
      )
    }
  }
  Spot.init({
    address: {
      type: DataTypes.STRING,
      allowNull: false,

    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    name:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avgRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    previewImage: {
      type: DataTypes.STRING,
      defaultValue:null,
      references:{
        model: 'Image',
        key: 'imageableId'
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',
    defaultScope:{
      attributes: {
exclude:['ownerId','createdAt','updatedAt']
   } }
  });
  return Spot;
};
