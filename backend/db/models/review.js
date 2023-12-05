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
    //~ this on delete was breaking the code!
    // onDelete:'CASCADE',
    // hooks:true
  }
)
      Review.hasMany(
        models.Image,
        {
          foreignKey: 'imageableId',
          as: 'reviewImages',
          constraints:false,
          scope:{
            imageableType: 'Review'
          }
        }
      )

Review.belongsTo(models.User,
  // {
  // onDelete: 'CASCADE',
  // hooks: true
// }
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
      defaultValue: 1
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references: {
        model: 'Users',
        onDelete: 'CASCADE',
        hooks: true
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model: 'Spots',
        onDelete: 'CASCADE',
        hooks:true
      }
    }
  }, {
    sequelize,
    modelName: 'Review',tableName:'Reviews',
  });
  return Review;
};
