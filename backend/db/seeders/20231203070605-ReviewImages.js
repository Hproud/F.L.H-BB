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
//   imageableType: 'Review',
//   url: '/review/test1',
//   preview: false
// },{
//   imageableId: 4,
//   imageableType: 'Review',
//   url: '/review/test2',
//   preview: false
// },{
//   imageableId: 1,
//   imageableType: 'Review',
//   url: '/review',
//   preview: false
// },{
//   imageableId: 5,
//   imageableType: 'Review',
//   url: '/review/pic1',
//   preview: false
// },{
//   imageableId: 3,
//   imageableType: 'Review',
//   url: '/review/true',
//   preview: false
// },{
//   imageableId: 1,
//   imageableType: 'Review',
//   url: '/review/maybe',
//   preview:false
// },{
//   imageableId: 4,
//   imageableType: 'Review',
//   url: '/review/nice',
//   preview:false
// },{
//   imageableId: 6,
//   imageableType: 'Review',
//   url: '/reviewed/approved',
//   preview:true
// },{
//   imageableId: 8,
//   imageableType: 'Review',
//   url: '/testurl/review1',
//   preview:false
// },{
//   imageableId: 9,
//   imageableType: 'Review',
//   url: '/review/3',
//   preview:true
// },
// {
//   imageableId:10 ,
//   imageableType: 'Review',
//   url: '/picture/reviewed/test',
//   preview:true
// },{
//   imageableId: 7,
//   imageableType: 'Review',
//   url: '/review/test1',
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
