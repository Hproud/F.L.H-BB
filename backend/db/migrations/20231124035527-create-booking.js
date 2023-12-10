'use strict';
/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
};

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull:false,
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: 'Spots',
          onDelete: 'CASCADE',
          hooks:true
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        // references:{
        //   model: 'Users',
        //   onDelete: 'CASCADE',
        //   hooks: true
        // }
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')

      }
    },options);
  },
  async down(queryInterface, Sequelize) {
    options.tableName = "Bookings"
    return queryInterface.dropTable(options);
  }
};
