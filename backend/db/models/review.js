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




      Review.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          onDelete: 'CASCADE',
          hooks:true
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
      defaultValue: 0.0
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      refernces: {
        model: 'User',
        key: 'id'
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      refernces: {
        model: 'Spot',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Review',
  });
  return Review;
};
