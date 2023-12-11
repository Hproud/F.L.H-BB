'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
    */
   static associate(models) {


User.hasMany(models.Booking,{
  foreignKey: 'userId',
  onDelete:'CASCADE',
  as: 'userId',
  hooks: true
})
    User.hasMany(models.Spot,{
      as: 'Owner',
      foreignKey: 'ownerId',
      onDelete:'CASCADE',
      hooks:true
    })
    
    User.belongsToMany(
      models.Spot,{
        through: models.Booking,
      foreignKey: 'userId',
        otherKey: 'spotId',
      }
   ),

    User.hasMany(
      models.Review,{
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        hooks:true
      }
    )
    }
  }
  User.init({
    firstName: {
    type: DataTypes.STRING,
    allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
        },
    username: {
      type: DataTypes.STRING,
    allowNull:false,

    },
    email: {
      type: DataTypes.STRING,
    allowNull: false,
    validate:{
      len: [3,256],
      isEmail:true
    }
    },
    hashedPassword:{
      type: DataTypes.STRING,
    allowNull: false,
    validate:{
      len: [60,60]
    }
  },
  }, {
    sequelize,
    modelName: "User",tableName:'Users',
    defaultScope: {
      attributes: {
        exclude: ['hashedPassword','email','createdAt','updatedAt']
      }
    }
  }
  );
  return User
};
