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

      Review.belongsToMany(
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
    review: DataTypes.STRING,
    stars: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    spotId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
