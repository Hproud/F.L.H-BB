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
      Spot.belongsToMany(
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
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    country: DataTypes.STRING,
    lat: DataTypes.INTEGER,
    lng: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
