'use strict';
const {
  Model,
  Validator
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
Spot.belongsTo(models.User,{
  foreignKey: 'userId'
})                                 //^ added 1817 12/10

Spot.hasMany(
  models.Review, {
    foreignKey: 'spotId',
  onDelete:'CASCADE',
  hooks: true
  }
)
      Spot.belongsTo(
        models.User,{
          foreignKey: 'ownerId',
          as: 'Owner',
          onDelete: 'CASCADE',
          hooks:true
        }
      ),

Spot.belongsToMany(models.User,{
  through: models.Booking,
  foreignKey: 'spotId',
  otherKey:'userId',
  onDelete: 'CASCADE',
  hooks: true
})

// Spot.hasMany(models.Booking,{
//   foreignKey: 'spotId',
//   onDelete:'CASCADE',
//   hooks:true
// })
//&-----------------------------
      Spot.hasMany(
        models.Review,{
          foreignKey: 'spotId',
          // as:'spotId',
          onDelete:'CASCADE',
          hooks:true
        }
      ),
//&----------------------------------
      Spot.hasMany(
        models.Image,{
          foreignKey: 'imageableId',
          as: 'SpotImages',
          constraints:false,
          scope:{
            imageableType: 'Spot',
          },
          onDelete: 'CASCADE',
          hooks:true
        }
        )
      }
    }
    Spot.init({
ownerId:{
  type: DataTypes.INTEGER,
  references:{
    model: 'User',
  //   key: 'id'
  }
  // allowNull: false
},
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
      validate:{
        len:[3,300]
      }
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
      type: DataTypes.FLOAT,
      allowNull: false,
        min: -90.0000000,
        max: 90.00000000
    },
    lng: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate:{
        min: -180,
        max: 180
      }
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
      validate:{
        isNumeric: true,
        min: 0
      }
    },
    avgRating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    previewImage: {
      type: DataTypes.STRING,
      defaultValue:false,
      references:{
        model: 'Image',
        key: 'imageableId'
      }
    }
  }, {
    sequelize,
    modelName: 'Spot',

  });
  return Spot;
};
