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
    foreignKey: 'spotId',
    onDelete:'CASCADE',
    hooks:true
  }
)
      Review.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          as: 'ReviewImages',
          constraints:false,
          scope:{
            imageableType: 'Review'
          }
        }
      )

Review.belongsTo(models.User)

    }


  }
  Review.init({
    review: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    stars: {
      type: DataTypes.DECIMAL,
      defaultValue: 1
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    }
  }, {
    sequelize,
    modelName: 'Review',tableName:'Reviews',
  });
  return Review;
};
