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
   try{
   await Review.bulkCreate([
    {
      review: 'this was awesome',
      stars: 5,
      userId: 3,
      spotId: 3,
    },
    {
      review: 'well alright',
      stars: 3,
      userId: 1,
      spotId: 2,
    },
    {
      review: 'it was Ok',
      stars: 3,
      userId: 3,
      spotId: 1,
    },
    {
      review: 'the kids and wife loved it!',
      stars: 5,
      userId: 3,
      spotId: 6,
    },
    {
      review: 'staff were not very friendly but the room was nice',
      stars: 2,
      userId: 4,
      spotId: 8,
    },
    {
      review: 'it smelled like cows, too many farms around for my taste',
      stars: 1,
      userId: 2,
      spotId: 10,
    },
    {
      review: 'Loved all the cool gagets from the museum!',
      stars: 4,
      userId: 5,
      spotId: 7,
    },
    {
      review: 'there wasn`t much to do or see unfortunately',
      stars: 1,
      userId: 3,
      spotId: 6,
    },
    {
      review: 'absolutely LOVED IT!!!!',
      stars: 5,
      userId: 4,
      spotId: 4,
    },
    {
      review: 'This was a great family trip',
      stars: 3,
      userId: 1,
      spotId: 9,
    },
    {
      review: 'was located around everything we loved!',
      stars: 4,
      userId: 3,
      spotId: 5,
    },
   ],{validate: true })
  }catch(err){
    console.log('this is my error', err)
  }
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
