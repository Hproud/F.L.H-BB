'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     Booking.belongsTo(
      models.User, {
        foreignKey: 'id',
        onDelete: 'CASCADE',
        hooks: true
      },


Booking.belongsTo(
  models.Spot,{
    foreignKey: 'spotId',
    onDelete: 'CASCADE',
    hooks: true
  }


)

     )
    }
  }
  Booking.init({
    startDate: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    endDate: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
