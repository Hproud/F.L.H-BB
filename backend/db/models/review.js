'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
Review.belongsTo(
  models.Spot,{
    foreignKey: 'spotId'
  }
)
      Review.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          as: 'ReviewImages',
          constraints:false,
          onDelete:'CASCADE',
          hooks:true,
          scope:{
            imageableType: 'Review'
          }
        }
      )

Review.belongsTo(models.User,
 { foreignKey: 'userId'}
)
    }


  }
  Review.init({
    review: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    stars: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      // references: {
      //   model: 'User',
      //   key:'id',    //^ added 1003 12/10
      //   onDelete: 'CASCADE',
      //   hooks: true
      // }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      // references:{
      //   model: 'Spot',
      //   onDelete:'CASCADE'
      // }
    }
  }, {
    sequelize,
    modelName: 'Review',tableName:'Reviews',
  });
  return Review;
};
