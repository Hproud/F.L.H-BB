const express = require('express');
const bcrypt= require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Review,Image,Booking,User} = require('../../db/models');
const { validationResult } = require('express-validator');


const router = express.Router();
// const currUser = req.user.dataValues.id;


const validateSpot = [
   check('address')
   .exists({checkFalsy:true})
   .notEmpty()
   .isLength({min:3})
   .isString({checkFalsy:true})
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
//?-----------------------------------------------------------------?//

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


//?===============================================================================?//


router.post('/:spotId/images',requireAuth, async (req,res,next) =>{
   const spotId = Number(req.params.spotId)
   const {url,preview} = req.body;
const currUser = req.user.id
   // console.log(req.user.id,'--------------------------')
   // res.json('hello');
   const property = await Spot.findOne({
      where:{
         id : spotId
      }
   });
   // console.log(property,'<-----------property-------------');

   // console.log(currUser,'<-----------currUser-------------');
   // console.log(property.ownerId,'<-----------ownerId-------------');


      if(property.ownerId === currUser){
         const pic = await Image.create({
   url,
   preview,
   imageableId: spotId,
   imageableType: "Spot"
      })
res.json({
         id:pic.id,
         url:pic.url,
         preview: pic.preview
      }
      )
   }
   else{
         const err = Error('Forbidden')
         err.status = 404,
         err.title ='Forbidden';
         err.message = 'Forbidden'
         next(err)
      }


      // console.log(pic)


})

//?-----------------------------------------------------------------?//

//?    make sure to come back and test after you do add image one! DONE

router.get('/:spotId',async(req,res,next)=>{
   let id = Number(req.params.spotId);
console.log(id,"ghjhgjkhgjghfhgfhgfghjfghfhgj")
// console.log(req,'this is the requests-------------------------------------------------')
const location = await Spot.findOne({
   where:{
      id: id,
   },
   include: [{
      model: Image,
      as: 'SpotImages',
      where:{
         imageableId: id,
         imageableType: 'Spot',
      },



   }, {
      model: User,
      as: 'Owner',
      attributes: ['firstName','lastName']}]
});
if(!location){
 const err = Error('Spot couldn`t be found');
 err.status = 404;
 err.title = "Spot not found"
 err.message= 'Spot couldn`t be found'
 next(err)
}else{
   res.json(location)
}
});


//?-----------------------------------------------------------------?//

router.get('/:ownerId',requireAuth,async(req,res,next) => {
const currUser = req.user.dataValues.id;

const {ownerId} = req.params;
if(Number(ownerId) === currUser){
   const properties = await Spot.findAll({
      where:{
         ownerId: currUser
      }
   })

res.json(properties)
}else{
   const err = Error('Forbidden')

   err.title='Forbidden',
   err.message= 'You can only view properties that you own',
   err.status=402;
   next(err)
}





})

//?-----------------------------------------------------------------?//
router.get('/',async (req,res,next)=>{
 const allSpots = await Spot.findAll();

 for(let i = 0; i < allSpots.length;i++){
   id = allSpots[i].id;
   const avg = await getAvg(id);
   allSpots[i].avgRating = avg
 }

 res.json(allSpots)
});


//?--------------------     NOT WORIKING    ------------------------?//
router.post('/',validateSpot,requireAuth,async(req,res,next) =>{
   const {address,city,state,country,lat,lng,name,description,price} = req.body

const ownerId = req.user.dataValues.id
const check = await Spot.findOne({
   where:{
address: ""
   }
});
// console.log('=========',req.user.dataValues.id,'==========')
if(!check){
   const newSpot = await Spot.create({
      ownerId: ownerId,
      address,
      city,
      state,
      country ,
      lat ,
      lng ,
      name,
      description ,
      price
   })

   res.json(newSpot)

   }
   else{
      res.status(400)
      // next(err)
      const err = Error('Location already exists');

      err.message= "Location already exists";
      err.title='Location already exists';
      err.status = 400
next(err)
   }

})


router.delete('/:spotId',requireAuth, async(req,res,next)=>{
   const id = Number(req.params.spotId);
const theSpot = await Spot.findOne({
   where:{
      id: id
   }
})
// console.log('=======================',theSpot,'=============================')
await theSpot.destroy();

res.json('Successfully deleted')
})





module.exports = router;
