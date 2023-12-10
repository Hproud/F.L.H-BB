'use strict';
const {Booking} =require('../models');
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
try{
   await Booking.bulkCreate([
    {
      startDate: '2023-12-05',
      endDate: '2023-12-20',
      spotId: 1,
      userId:2
    },
    {
      startDate: '2024-01-05',
      endDate: '2024-1-6',
      spotId: 3,
      userId:3
    },
    {
      startDate: '2023-12-23',
      endDate: '2023-12-26',
      spotId: 2,
      userId:1
    },
    {
      startDate: '2023-12-15',
      endDate: '2023-12-18',
      spotId: 9,
      userId:3
    },
    {
      startDate: '2023-12-05',
      endDate: '2023-12-20',
      spotId: 8,
      userId:4
    },
    {
      startDate: '2023-09-05',
      endDate: '2023-11-20',
      spotId: 3,
      userId:6
    },
  ],{validate: true })
}catch(err){
   console.log("this is my error console: ", err)
}

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      userId: { [Op.in]: [1,3,2]}
    },{});
  }
};
