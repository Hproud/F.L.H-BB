'use strict';
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
  };
    // define your schema in options object
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Spots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,

      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
        validate:{
          len: [2,265],

        }


      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [4,100],
          isAlpha: true
        }

      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          len: [3,200],
isAlpha: true,
        }

      },
      lat: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isDecimal: true
        }

      },
      lng: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isDecimal: true
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [5,265],
          isAlpha: true,
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      ownerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default: Sequelize.literal('CURRENT_TIMESTAMP')

      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        default: Sequelize.literal('CURRENT_TIMESTAMP')

      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Spots');
  }
};
