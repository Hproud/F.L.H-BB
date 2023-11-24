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
        models.User,{
          foreignKey: 'id',
          onDelete: 'CASCADE',
          hooks:true
        }
      ),

      Review.belongsTo(
        models.Spot, {
          foreignKey: 'id',
          onDelete: 'CASCADE',
          hooks:true
        }
      ),

      Review.hasOne(
        models.Image,{
          foreignKey: 'imageableId'
        }
      )


    }


  }
  Review.init({
    review: {
      type: DataTypes.STRING,
      allowNull:false,
    },
    stars: {
      type: DataTypes.DECIMAL,
      defaultValue: 0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
