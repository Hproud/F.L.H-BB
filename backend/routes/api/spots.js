const express = require('express');
const bcrypt= require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {Spot,Review,Image,Booking} = require('../../db/models');
const spot = require('../../db/models/spot');
const review = require('../../db/models/review');

const router = express.Router();

const validateSpot =[
   check('address')
   .exists({checkFalsy: true})
   .withMessage('Street address is required'),
   check('city')
   .exists({checkFalsy: true})
   .withMessage('City is required'),
   check('state')
   .exists({checkFalsy: true})
   .withMessage('State is required'),
   check('country')
   .exists({checkFalsy: true})
   .withMessage('Country is required'),
   check('lat')
   .exists({checkFalsy: true})
   .isNumeric({min:-90, max:90})
   .withMessage('Latitude must be within -90 and 90'),
   check('lng')
   .exists({checkFalsy: true})
   .isNumeric({min:-180, max:180})
   .withMessage('Longitude must be within -180 and 180'),
   check('name')
   .exists({checkFalsy: true})
   .isLength({max:50})
   .withMessage('Name must be less than 50 characters'),
   check('description')
   .exists({checkFalsy: true}),
   check('price')
   .exists({checkFalsy: true})
   .isNumeric({min:0})
   .withMessage('Price per day must be a positive number')
];

const getAvg = async (id) =>{
   const allReviews = await Review.findAll({
      where: {
        spotId: id
      },
      attributes: ['stars']
    });
    let avg
    const count = allReviews.length;
   //  console.log(count,'this is the count')
   let sum = 0;
   // console.log(sum,"sum before for each");
   allReviews.forEach((record) =>{
      const rate = record.dataValues.stars
      // console.log(rate,' this is the rate from the foreach');
      sum += rate
   });
   // console.log(sum,"sum after for each");
if(count > 0){
  avg = sum / count;
}else{
   avg = 0
};
// console.log(avg,'this is the avg we get from our func')
    return avg
};





router.get('/',async (req,res,next)=>{
 const allSpots = await Spot.findAll();

 for(let i = 0; i < allSpots.length;i++){
   id = allSpots[i].id;
   const avg = await getAvg(id);
   allSpots[i].avgRating = avg
 }

 res.json(allSpots)
});

router.post('/',requireAuth,validateSpot,async(req,res,next) =>{
const check = await Spot.findOne({
   where:{
address: req.body.address
   }
});

if(!check){
   const newSpot = await Spot.create({
      ownerId: req.body.ownerId,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country,
      lat: req.body.lat,
      lng: req.body.lng,
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
   });

   res.json(newSpot)

}else{
   res.status(400)
   next(err)
 throw new Error('location already exists')
}

})






module.exports = router;
