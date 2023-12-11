'use strict';
const {Spot} = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {
try
{    await Spot.bulkCreate([
      {
        ownerId: 1,
        address: '13 cowboy lane',
        city: 'Dallas',
        state: 'Texas',
        country: 'USA',
        lat: 25.1548615,
        lng: 90.1628379,
        name: 'Test spot 1',
        description: 'cozy little tent with a great fire',
        price: 200,
        previewImage: '/mytest/1'
      },
      {
        ownerId: 3,
        address: '30 Money lane',
        city: 'Omaha',
        state: 'Nebraska',
        country: 'USA',
        lat: 52.4865297,
        lng: -3.4879331,
        name:  'Test spot 2',
        description: 'Under the ocean swimming with fish',
        price: 20,
        previewImage: '/mytest/2'
      },
      {
        ownerId: 2,
        address: '12 tell me lane',
        city: 'Dallas',
        state: 'Texas',
        country: 'USA',
        lat: 25.1548615,
        lng: -150.1628379,
        name: 'Test spot 3',
        description: 'cozy little tent with a great fire',
        price: 200,
        previewImage: '/mytest/3'
      },
      {
        ownerId: 3,
        address: '120 tell me lane',
        city: 'My City',
        state: 'Ohio',
        country: 'USA',
        lat: 25.1872215,
        lng: -179.1628379,
        name: 'Test spot 4',
        description: 'super soft couches',
        price: 150,
        previewImage: '/mytest/4'
      },
      {
          ownerId: 1,
        address: '158 test ave',
        city: 'Dallas',
        state: 'Texas',
        country: 'USA',
        lat: 25.1548615,
        lng: -2.1797379,
        name: 'Test spot 5',
        description: 'the nicest castle you will see',
        price: 1000,
        previewImage: '/mytest/5'
      }, {
        ownerId: 4,
        address: '22 Blinking St',
        city: 'Nowhere',
        state: 'Ohio',
        country: 'USA',
        lat: 89.1548615,
        lng: -100.1628379,
        name: 'Test spot 6',
        description: 'Great place for kids!',
        price: 80,
        previewImage: '/mytest/6'
      },
      {
        ownerId: 1,
        address: '1001 Robot Ln',
        city: 'memphis',
        state: 'Tenn',
        country: 'USA',
        lat: 5.4865297,
        lng: 120.4879331,
        name:  'Test spot 7',
        description: 'we have lots of places to BBQ',
        price: 5,
        previewImage: '/mytest/7'
      },
      {
        ownerId: 3,
        address: '808 wait up rd',
        city: 'Tokyo',
        state: 'Japan',
        country: 'East Asia',
        lat: 1.1548615,
        lng: -179.1628379,
        name: 'Test spot 8',
        description: 'Great views and lots to do around the location!',
        price: 350,
        previewImage: '/mytest/8'
      },
      {
        ownerId: 5,
        address: '404 cant find me ave',
        city: 'test City 1',
        state: 'calgery',
        country: 'canada',
        lat: 75.1872215,
        lng: -1.1628379,
        name: 'Test spot 9',
        description: 'We pride ourselves on giving you privacy',
        price: 404,
        previewImage: '/mytest/9'
      },
      {
          ownerId: 3,
        address: '12 candy lane',
        city: 'Bluford',
        state: 'Illinois',
        country: 'USA',
        lat: 55.1548615,
        lng: -102.1797379,
        name: 'Test spot 10',
        description: 'We have absolute fine dining',
        price: 2000,
        previewImage: '/mytest/10'
      },


    ],{validate: true })
  }catch(err){console.log('this is my error', err)}},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      city: { [Op.in]: ['Dallas','Omaha','My City']}
    },{});
  }
};
