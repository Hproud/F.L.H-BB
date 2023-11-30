// 'use strict';
// const {Booking} =require('../models');

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;
// }
// /** @type {import('sequelize-cli').Migration} */
// module.exports = {
//   async up (queryInterface, Sequelize) {
//     /**
//      * Add seed commands here.
//      *
//      * Example:
//      * await queryInterface.bulkInsert('People', [{
//      *   name: 'John Doe',
//      *   isBetaMember: false
//      * }], {});
//     */
//    await Booking.bulkCreate([
//     {
//       startDate: '2023-12-5',
//       endDate: '2023-12-20',
//       spotId: 1,
//       userId:2
//     },
//     {
//       startDate: '2024-1-5',
//       endDate: '2024-1-6',
//       spotId: 3,
//       userId:3
//     },
//     {
//       startDate: '2023-12-23',
//       endDate: '2023-12-26',
//       spotId: 2,
//       userId:1
//     },
//     {
//       startDate: '2023-12-15',
//       endDate: '2023-12-18',
//       spotId: 3,
//       userId:3
//     },
//   ],{validate: true })
//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     options.tableName = 'Bookings';
// const Op = Sequelize.Op;
//     await queryInterface.bulkDelete(options, {
//       spotId: { [Op.in]: [1,3,2]}
//     },{});
//   }
// };
'use strict';
const {Booking} =require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
/** @type {import('sequelize-cli').Migration} */
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
      startDate: '2023-12-5',
      endDate: '2023-12-20',
      spotId: 1,
      userId:2
    },
    {
      startDate: '2024-1-5',
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
      spotId: 3,
      userId:3
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
      spotId: { [Op.in]: [1,3,2]}
    },{});
  }
};
