'use strict';
const {User} = require('../models');
const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await User.bulkCreate([
      {
        email: 'demo@user.io',
        username: 'Demo-lition',
        hashedPassword: bcrypt.hashSync('password'),
        firstName: 'Jane',
        lastName: 'Doe'
      },
      {
        email: 'user1@user.io',
        username: 'FakeUser1',
        hashedPassword: bcrypt.hashSync('password2'),
        firstName: 'jake',
        lastName: 'smith'
      },
      {
        email: 'user2@user.io',
        username: 'FakeUser2',
        hashedPassword: bcrypt.hashSync('password3'),
        firstName: 'jimmy',
        lastName: 'cool'
      }
    ],{validate: true });

  },

  async down (queryInterface, Sequelize) {
options.tableName = 'Users';
const Op = Sequelize.Op;
return queryInterface.bulkDelete(options, {
  username: { [Op.in]: ['Demo-lition','FakeUser1','FakeUser2']}
},{});
  }
};
