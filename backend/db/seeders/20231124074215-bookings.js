'use strict';

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
   await queryInterface.bulkCreate('bookings',[
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
      spotId: 4,
      userId:1
    },
    {
      startDate: '2023-12-15',
      endDate: '2023-12-18',
      spotId: 2,
      userId:3
    },
  ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('bookings',{})
  }
};
