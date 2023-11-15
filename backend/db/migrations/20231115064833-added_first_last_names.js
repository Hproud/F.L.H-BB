'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
await queryInterface.addColumn('users','firstName',{
  type: DataTypes.STRING,

  validate: {
    allowNull: false
  }
});
await queryInterface.addColumn('users','lastName',{
  type: DataTypes.STRING,
  validate:{
    allowNull:false
  }
});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('users','firstName');
    await queryInterface.removeColumn('users','lastName');

  }
};
