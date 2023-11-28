'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      review: {
        type: Sequelize.STRING,
        allowNull:false,
        validate: {
          len: [{
            min: 3,
          }]
        }
      },
      stars: {
        type: Sequelize.DECIMAL,
        allowNull: false,
        default: 0.0,
      },
      userId: {
        type: Sequelize.INTEGER,
        // references:{
        //   model: 'User',
        //   key: 'id'
        // }
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Spot',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Reviews"
    return queryInterface.dropTable(options);

  }
};
