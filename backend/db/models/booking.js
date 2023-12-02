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

//  Booking.belongsToMany(
//   models.Spot,{
//     foreignKey: 'spotId'
//   })\

Booking.belongsTo(models.Spot,{
  foreignKey: 'spotId'
})

Booking.belongsTo(models.User,{
  foreignKey: 'userId',
  onDelete: 'CASCADE',
  hooks:true
})

    }
  }
  Booking.init({
    startDate: {
      type: DataTypes.DATE,
      allowNull:false,
      validate:{
        isNotInPast(value){
          const start = new Date(value);
          const today = new Date();
          if(today > start){
            throw new Error('Checkin date cannot be in the past')
          }

        }
      }
      },
    endDate: {
      type: DataTypes.DATE,
      allowNull:false,
 validate:{
  ifAfterStart(value){
    const end = new Date(value);
    const start = new Date(this.startDate)
    if(end < start){
      throw new Error('End date must be after your start date')
    }
  }
 }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      // references: {
      //   model: Spot,
      //   foreignKey: 'spotId'
      // }


    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references:{
      //   model: 'User',
      //   key: 'id'
      // }
    }
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
