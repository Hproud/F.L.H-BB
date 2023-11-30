'use strict';
const {
  Model, Validator
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
  models.Spot,{
    foriegnKey: 'spotId'
  }
 )

Booking.belongsTo(models.User)

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
      validate: {
        // isDate: true,
        // isAfter: this.startDate
        isAfterStartDate(value){
          const checkIn = this.startDate;
          if(value < checkIn){
            throw new Error('Please enter a date after your check in date.')
          }
        }
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: 'Spot',
        key: 'id'
      }


    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references:{
        model: 'User',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
