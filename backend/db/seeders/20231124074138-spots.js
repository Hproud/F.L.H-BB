'use strict';
const {Spot} = require('../models');

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  async up (queryInterface, Sequelize) {

    await Spot.bulkCreate([
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
      },
      {
        ownerId: 2,
        address: '12 tell me lane',
        city: 'Dallas',
        state: 'Texas',
        country: 'USA',
        lat: 25.1548615,
        lng: -150.1628379,
        name: 'Test spot 1',
        description: 'cozy little tent with a great fire',
        price: 200,
      },
      {
        ownerId: 3,
        address: '120 tell me lane',
        city: 'My City',
        state: 'Ohio',
        country: 'USA',
        lat: 25.1872215,
        lng: -179.1628379,
        name: 'Test spot 3',
        description: 'super soft couches',
        price: 150,
      },
      {
          ownerId: 1,
        address: '158 test ave',
        city: 'Dallas',
        state: 'Texas',
        country: 'USA',
        lat: 25.1548615,
        lng: -2.1797379,
        name: 'Test spot 4',
        description: 'the nicest castle you will see',
        price: 1000,
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
    options.tableName = 'Spots';
const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      city: { [Op.in]: ['Dallas','Omaha','My City']}
    },{});
  }
};
