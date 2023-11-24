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
          foreignKey: 'id',
          onDelete: 'CASCADE',
          hooks:true
        }
      ),
      Spot.belongsTo(
        models.Booking,{
          foreignKey: 'spotId'
        }
      ),

      Spot.hasMany(
        models.Review,{
          foreignKey: 'spotId'
        }
      ),

      Spot.hasMany(
        models.Image,{
          foreignKey: 'imageableId'
        }
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
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
