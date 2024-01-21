'use strict';
const {Image} =require('../models');
/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
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
   await Image.bulkCreate([
{
  imageableId: 2,
  imageableType: 'Spot',
  url: '/test/test1',
  preview: false
},{
  imageableId: 5,
  imageableType: 'Spot',
  url: 'https://i.insider.com/5102b07e6bb3f7f105000006?width=600&format=jpeg',
  preview: true
},{
  imageableId: 1,
  imageableType: 'Spot',
  url: 'https://i.insider.com/5db0cd17e94e8647fd02727b?width=1000&format=jpeg&auto=webp',
  preview: true
},{
  imageableId: 2,
  imageableType: 'Spot',
  url: 'https://superyachttechnologynetwork.com/wp-content/uploads/2017/03/Underwater-homes-980x551.jpg',
  preview: true
},{
  imageableId: 3,
  imageableType: 'Spot',
  url: 'https://media.architecturaldigest.com/photos/56748b18b313ecbd18113301/master/pass/beach-house-designs-seaside-living-book-10.jpg',
  preview:true
},{
  imageableId: 4,
  imageableType: 'Spot',
  url: 'https://www.thehousedesigners.com/images/uploads/SiteImage-Landing-contemporary-house-plans-1.webp',
  preview:true
},{
  imageableId: 6,
  imageableType: 'Spot',
  url: 'https://thinkrealty.com/wp-content/uploads/2019/10/Big-Backyard.jpeg',
  preview:true
},{
  imageableId: 8,
  imageableType: 'Spot',
  url: 'https://qph.cf2.quoracdn.net/main-qimg-03051c3fade3f3a2d9b27faaf81a4101-lq',
  preview:true
},{
  imageableId: 9,
  imageableType: 'Spot',
  url: 'https://www.realestate.com.au/news-image/w_2000,h_1500/v1662076243/news-lifestyle-content-assets/wp-content/production/white-wooden-fence-design-elm_34334192800.jpg?_i=AA',
  preview:true
},
{
  imageableId:10 ,
  imageableType: 'Spot',
  url: 'https://plus.unsplash.com/premium_photo-1661883964999-c1bcb57a7357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bHV4dXJ5JTIwaG91c2V8ZW58MHx8MHx8fDA%3D',
  preview:true
},{
  imageableId: 7,
  imageableType: 'Spot',
  url: 'https://images.trvl-media.com/lodging/20000000/19380000/19371600/19371549/528ff0ec.jpg?impolicy=fcrop&w=608&h=342&p=0.5',
  preview:true
}
  ],{validate: true })
}catch(err){
   console.log("this is my error console: ", err)
}

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Images';
const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      imageableId: { [Op.in]: [1,2,3,4,5]}
    },{});
  }
};
