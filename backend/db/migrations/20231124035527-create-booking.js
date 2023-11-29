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
        // validate:{
        //   isDate: true,
        //   isAfter: Sequelize.literal('CURRENT_TIMESTAMP')
        //   // isToday(value){
        //   //   const currDate = Sequelize.literal('CURRENT_TIMESTAMP');
        //   //   if(currDate > value){
        //   //     throw new Error('Start date can not be in the past.')
        //   //   }
        //   // },

        // }
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull:false,
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull:false,
      //   references:{
      //     model: 'Spot',
      //     key: 'id'
      //   }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
