// 'use strict';
// const {Image} =require('../models');
// /** @type {import('sequelize-cli').Migration} */

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;
// }
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
// try{
//    await Image.bulkCreate([
// {
//   imageableId: 2,
//   imageableType: 'Spot',
//   url: '/test/test1',
//   preview: false
// },{
//   imageableId: 5,
//   imageableType: 'Spot',
//   url: '/test/test2',
//   preview: true
// },{
//   imageableId: 1,
//   imageableType: 'Spot',
//   url: '/test3',
//   preview: true
// },{
//   imageableId: 2,
//   imageableType: 'Spot',
//   url: '/test/pic1',
//   preview: true
// },{
//   imageableId: 3,
//   imageableType: 'Spot',
//   url: '/test/yes',
//   preview:true
// },{
//   imageableId: 4,
//   imageableType: 'Spot',
//   url: '/test/maybe',
//   preview:true
// },{
//   imageableId: 6,
//   imageableType: 'Spot',
//   url: '/tested/approved',
//   preview:true
// },{
//   imageableId: 8,
//   imageableType: 'Spot',
//   url: '/testurl/1',
//   preview:true
// },{
//   imageableId: 9,
//   imageableType: 'Spot',
//   url: '/test/3',
//   preview:true
// },
// {
//   imageableId:10 ,
//   imageableType: 'Spot',
//   url: '/picture/test',
//   preview:true
// },{
//   imageableId: 7,
//   imageableType: 'Spot',
//   url: '/why/test',
//   preview:true
// }
//   ],{validate: true })
// }catch(err){
//    console.log("this is my error console: ", err)
// }

//   },

//   async down (queryInterface, Sequelize) {
//     /**
//      * Add commands to revert seed here.
//      *
//      * Example:
//      * await queryInterface.bulkDelete('People', null, {});
//      */
//     options.tableName = 'Images';
// const Op = Sequelize.Op;
//     await queryInterface.bulkDelete(options, {
//       imageableId: { [Op.in]: [1,2,3,4,5]}
//     },{});
//   }
// };
