'use strict';
const {Review} = require('../models');


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
   await Review.bulkCreate([
    {
      review: 'this was awesome',
      stars: 5.0,
      userId: 2,
      spotId: 3,
    },
    {
      review: 'well alright',
      stars: 2.5,
      userId: 1,
      spotId: 2,
    },
    {
      review: 'it was Ok',
      stars: 3.0,
      userId: 3,
      spotId: 1,
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
    options.tableName = 'Reviews';
const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: ['3','2','1']}
    },{});
  }
};
