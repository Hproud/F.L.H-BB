const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Review,Image,Booking,User} = require('../../db/models');
// const { validationResult } = require('express-validator');
const {Op} = require('sequelize')


const router = express.Router();

const validateSpot = [
   check('address')
   .trim()
   .notEmpty()
   .withMessage('Street address is required'),
   check('city')
   .trim()
   .exists({checkFalsy: true})
   .withMessage('City is required'),
   check('state')
   .trim()
   .exists({checkFalsy: true})
   .withMessage('State is required'),
   check('country')
   .trim()
   .exists({checkFalsy: true})
   .withMessage('Country is required'),
   check('lat')
   .exists({checkFalsy: true})
   .trim()
   .isFloat({min: -90,max: 90})
   .withMessage('Latitude must be within -90 and 90'),
   check('lng')
   .trim()
   .exists({checkFalsy: true})
   .isFloat({min: -180,max:180})
   .withMessage('Longitude must be within -180 and 180'),
   check('name')
   .trim()
   .exists({checkFalsy: true})
   .isLength({max:50})
   .withMessage('Name must be less than 50 characters'),
   check('description')
   .trim()
   .exists({checkFalsy: true})
   .withMessage('Description is required'),
   check('price')
   .trim()
   .exists({checkFalsy: true})
   .isFloat({min:0})
   .withMessage('Price per day must be a positive number'),
   handleValidationErrors
];


//?-------------------------------------------------------------------

const validateReview = [
   check('review')
   .trim()
   .exists({checkFalsy:true})
   .isLength({min: 1})
   .withMessage('Review text is required'),
   check('stars')
   .exists({checkFalsy: true})
   .isFloat({min:1, max:5})
   .withMessage('Stars must be an integer from 1 to 5'),
   handleValidationErrors
]

//?-----------------------------------------------------------------?//

validateDates = [
   check('startDate')
   // .exists({checkFalsy:true})
   .custom( value =>{
      const start = new Date(value);
          const today = new Date();
          if(start < today){
            throw new Error('startDate cannot be in the past')
          }else{
            return true
          }
   }),
   check('endDate')
   // .exists({checkFalsy:true})
   .custom((value,{req})=>{
      const end = new Date(value);
      const start = new Date(req.body.startDate);
      if(end <= start){
         throw new Error('endDate cannot be on or before startDate')
      }else{
         return true
      }
   }),
   handleValidationErrors
];
//?--------------------------------------------------------------------
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


//?================ADD IMAGES TO SPOT================================?//


router.post('/:spotId/images',requireAuth, async (req,res,next) =>{
   const spotId = Number(req.params.spotId)
   const {url,preview} = req.body;
   const currUser = req.user.dataValues.id
   const property = await Spot.findOne({
      where:{
         id : spotId
      }
   });


   if(property.ownerId === currUser){
      const pic = await Image.create({
   url:url,
   preview:preview,
   imageableId: spotId,
   imageableType: "Spot",
})
const location =property.toJSON()
// console.log(pic.preview);
if(pic.preview){
   await property.update({
      previewImage: url,
   })
}
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

//?-------------FIND ALL PROPERTIES USER OWNS------------------------?//

router.get('/current',requireAuth,async(req,res,next) => {
   const currUser = req.user.dataValues.id;
   // console.log(ownerId,"<--------------owner Id");



      const properties = await Spot.findAll({
         where:{
            ownerId: currUser
      }
   })

if(!properties){
   res.json('You do not have any properties listed')
}else{
    res.json(properties)
}

   }
)

//?------------------GET INFO ABOUT SPECIFIC SPOT-------------------?//

//&    make sure to come back and test after you do add image one! DONE

router.get('/:spotId',async(req,res,next)=>{
   let id =req.params.spotId
   // console.log(id,"ghjhgjkhgjghfhgfhgfghjfghfhgj")
   // console.log(req,'this is the requests-------------------------------------------------')
   const location = await Spot.findOne({
      where:{
         id: Number(id)
   },
   include:(
      {
      model: Image,
      as: 'SpotImages',
      where:{
         imageableId: id,
         imageableType: 'Spot',
      }
   },
    {
      model: User,
      as: 'Owner',
      attributes: ['firstName','lastName'],
   }
)
   });


   if(!location){
      const err = Error('Spot couldn`t be found');
      err.status = 404;
      err.title = 'Spot not found'
      err.message= 'Spot couldn`t be found'
      next(err)
   }else{


      res.json(location)
   }
});








//?---------------------GET ALL SPOTS--------------------------------?//
router.get('/',async (req,res)=>{

   // const allSpots = await Spot.findAll();
   // // console.log(allSpots)
   // for(let i = 0; i < allSpots.length;i++){
   //    id = allSpots[i].id;
   //    const avg = await getAvg(id);
   //    allSpots[i].avgRating = avg;

   // }

   const pagination = {}
   let {page,size} = req.query
   if(!page){
      page =1
   }
   if(!size){
      size = 1
   }
   page = parseInt(page);
   size = parseInt(size);

   if(Number.isInteger(page) && page > 10){
      page = 10
   }

   if(Number.isInteger(size) && size > 20){
      size = 20
   }

   if( Number.isInteger(page) && Number.isInteger(size) && page > 1 && page <20 &&  size > 0 && size < 20){
      pagination.limit = size;
      pagination.offset = size * (page -1)
   }else{
      pagination.limit = size;
      pagination.offset = (size * (page -1))
   }


   // let query = {}

   const {minLat,maxLat,minLng,maxLng,minPrice,maxPrice} = req.query;
   let where = {}

   // console.log(req.query)
   // console.log(minLat)
   if(minLat){
      where.lat = { [Op.gte]:minLat}
   }

   if(maxLat){
      where.lat = {[Op.lte]: maxLat}
   };

   if(minLng){
      where.lng = {[Op.gte]: minLng}
   }

   if(maxLng){
      where.lng = {[Op.lte]: maxLng}
   };

   if(minPrice){
      where.price = {[Op.gte]: minPrice}
   }

   if(maxPrice){
      where.price = {[Op.lte]: maxPrice}
   };

   let result = {};

   result.count = await Spot.count({where});
   result.rows = await Spot.findAll({where})
result.page = page || 1;
result.size = Math.ceil(result.count /size)

   // const filtered = await allSpots.rows.findAll(
      // )



      res.json({
         Spots: result.rows,
      page: result.page,
      size: result.size},)
         // }


      });

//?----------------------------ADD SPOT------------------------------?//
//&--------------------     fixed this bug   ------------------------?//
router.post('/',validateSpot,requireAuth,async(req,res,next) =>{
   const {address,city,state,country,lat,lng,name,description,price} = req.body
   // console.log(address,'<-------address');
   // console.log(city,'<-------city');
   // console.log(country,'<-------country');
   // console.log(lat,'<-------latitude');
   // console.log(lng,'<-------longitude');
   // console.log(name,'<-------name');
   // console.log(description,'<-------description');
   // console.log(price,'<-------price');
const ownerId = req.user.id
const checked = await Spot.findOne({
   where:{
address: address
   }
});
// console.log('=========',req.user.dataValues.id,'==========')
if(!checked){
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

//?-------------------------DELETE A SPOT----------------------------?//


router.delete('/:spotId',requireAuth, async(req,res,next)=>{
   const id = Number(req.params.spotId);
const theSpot = await Spot.findOne({
   where:{
      id: id
   }
})
// console.log('=======================',theSpot,'=============================')
if(theSpot){
   await theSpot.destroy();
   res.json('Successfully deleted')
}else{
   const err = new Error('Spot not found');
   err.message = 'Spot not found',
   err.status = 400
   next(err)
}

})

//?-------------------------------EDIT A SPOT PUT AND PATCH ROUTES----------------------------//?


router.put('/:spotId',validateSpot,requireAuth,async(req,res,next)=>{
   const id = req.params.spotId;
   const {address,city,state,country,lat,lng,name,description,price} = req.body;
// console.log(req.body,'req body is right here')
   const location = await Spot.findOne({
      where:{
         id: id
      }
   });

   if(!location){
      const err = Error('Spot couldn`t be found');
err.status= 404
      err.message = 'Spot couldn`t be found';
      next(err)
   };
// console.log(location, 'this is location')


// console.log(req.user.id,'<-------------------------------------this is ID');
// console.log(location.ownerId,'<-------------------------------------this is ownerID for location')
   if(req.user.id !== location.ownerId){

   const err = Error('You must own this property to make changes')
   err.status=400;
   err.title='Forbidden';
   err.message='You must own this property to make changes';
   next(err)
}else{
   const updated =  await Spot.update(
     {   address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
     },
        {
           where:{
              id: location.id
           }
        }
     );



   res.json(location)

}


});


router.patch('/:spotId',validateSpot,requireAuth,async(req,res,next)=>{
   const id = req.params.spotId;
   const {address,city,state,country,lat,lng,name,description,price} = req.body;

   const location = await Spot.findOne({
      where:{
         id: id
      }
   });

   if(!location){
      const err = Error('Spot couldn`t be found');
err.status= 404
      err.message = 'Spot couldn`t be found';
      next(err)
   };


// console.log(req.user.id,'<-------------------------------------this is ID');
// console.log(location.ownerId,'<-------------------------------------this is ownerID for location')


   if(Number(id) !== location.ownerId){


   const err = Error('You must own this property to make changes')
   err.status=400;
   err.title='Forbidden';
   err.message='You must own this property to make changes';
   next(err)
};

    const updated =  await Spot.update(
      {   address,
         city,
         state,
         country,
         lat,
         lng,
         name,
         description,
         price
      },
         {
            where:{
               id: location.id
            }
         }
      );



   res.json(location)

});



//?-----------------GET REVIEWS FOR SPOT BY SPOT ID---------------------

router.get('/:spotId/reviews',async (req,res,next) => {
   const {spotId} = req.params;
   // console.log(req.user.id)
   const place = await Spot.findOne({
      where: {
         id: spotId
      }
   });

   if(!place){
      const err = new Error('Spot couldnt be found');
      err.message= 'Spot couldn`t be found',
      err.status = 404
      next(err)
   }else{

      const locationReviews = await Review.findOne({
         where:{
            spotId: spotId
         },
         include: ([
            {
               model: User,
               attributes: ['id','firstName','lastName']
            },
            {
               model: Image,
               as: 'ReviewImages',
               attributes: ['id','url']
            }
         ])
      })


      return res.json(locationReviews)
   }

});

//?------------------CREATE NEW REVIEW BY SPOT ID----------------------

router.post('/:spotId/reviews',requireAuth,validateReview,async(req,res,next) => {
const {spotId} = req.params;
const {startDate,endDate} = req.body
const location = await Spot.findOne({
   where:{
      id: spotId
   }
});

if(!location){
   const err = new Error('Spot couldn`t be found');
   err.status = 404;
   err.message= 'Spot could`t be found'
   next(err)
}else{
   const {review,stars} = req.body
   const newReview = await Review.create({
      review,
      stars,
      userId: req.user.id,
      spotId: Number(spotId)
   });
   res.status = 201;
   res.json(newReview)
}

})


//?------------------GET ALL BOOKINGS FOR SPOT BY ID--------------------


router.get('/:spotId/bookings',requireAuth,async (req,res,next)=>{
   const {spotId} = req.params;
   const checking = await Spot.findOne({
      where: {
         id: spotId
      }
   });
   if(!checking){
      const err = new Error('Spot couldn\'t be found');
      err.status = 400;
      err.message = 'Spot couldn\'t be found';
      next(err)
   }else{

      if(req.user.id === checking.ownerId){
         // const location = await Booking.findAll({
         // where:{
         //    Id: spotId
         // },

         // include:{model: User,
         // attributes:['id','firstName','lastName']}
         // })
         const location = await Spot.findOne({
            where:{
               id: spotId
            },
            include: [{model: Booking,
            where: {
               spotId: spotId
            },
         include: {model: User,
         attributes: ['id','firstName','lastName']}}]
         })
console.log(location)
         res.json(location.dataValues)

      }else{
         const location = await Spot.findAll({
            where:{
               Id: spotId
            },
            attributes:['spotId','startDate','endDate'],
         });
         res.json(location)
      }


   }

})


//?--------------------------CREATE A BOOKING FROM THE SPOT ID--------------------------------

router.post('/:spotId/bookings',requireAuth,validateDates,async(req,res,next) => {
   const {spotId}= req.params;
   const id = Number(spotId)
const{startDate,endDate} = req.body
const begin = new Date(startDate);
const end = new Date(endDate)
console.log(req.body)
   const prospect = await Spot.findOne({
      where: {
         id: id
      }
   });

   if(!prospect){
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.message = 'Spot couldn\'t be found'
   }else{
      const currBookings = await Booking.findAll({
         where:{
            spotId: spotId
         }
      });

      // console.log(currBookings)
      for(let i=0; i< currBookings.length;i++){
         const current = currBookings[i];
         // console.log(new Date(current.startDate),'<------ current');
         // console.log(new Date(startDate))
         const reservedStart = new Date(current.startDate);
         const reservedEnd = new Date(current.endDate);
if(reservedStart < begin && reservedEnd > begin ){
   const err = new Error('Sorry, this spot is already booked for the specified dates')
      err.status = 403
      err.errors = {
         startDate: "Start date conflicts with an existing booking",
         // endDate: "End date conflicts with an existing booking"
      }
      next(err)
   }else
      if (reservedStart < end && reservedEnd > end){
         const err = new Error('Sorry, this spot is already booked for the specified dates')
         err.status = 403
         err.errors = {
      endDate: "End date conflicts with an existing booking"
         }
         next(err)
      }
   //  }else{
   //    break
   //  }

         }
      }

      const newRes = await Booking.create({
startDate,
endDate,
spotId: id,
userId: req.user.id
      });
      res.json(newRes)



});




















module.exports = router;
