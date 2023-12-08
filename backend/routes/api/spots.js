const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Review,Image,Booking,User} = require('../../db/models');
// const { validationResult } = require('express-validator');
const {Op} = require('sequelize')


const router = express.Router();

//?---------------------------------------------------------------------
const ValidateQueries = [
   check('page')
   .optional({checkFalsy:true})
   .isFloat({min:1})
   .withMessage('Page must be greater than or equal to 1'),
   check('size')
   .optional({checkFalsy:true})
   .isFloat({min:1})
   .withMessage('Size must be greater than or equal to 1'),
   check('minLat')
   .optional({checkFalsy:true})
   .isFloat({min: -90,max: 90})
   .withMessage('Minimum latitude is invalid'),
   check('maxLat')
   .optional({checkFalsy:true})
   .isFloat({min: -90,max: 90})
   .withMessage('Maximum latitude is invalid'),
   check('minLng')
   .optional({checkFalsy:true})
   .isFloat({min: -180,max:180})
   .withMessage('Minimum longitude is invalid'),
   check('maxLng')
   .optional({checkFalsy:true})
   .isFloat({min: -180,max:180})
   .withMessage('Maximum longitude is invalid'),
   check('minPrice')
   .optional({checkFalsy:true})
   .isFloat({min:0})
   .withMessage('Minimum price must be greater than or equal to 0'),
   check('maxPrice')
   .optional({checkFalsy:true})
   .isFloat({min:0})
   .withMessage('Maximum price must be greater than or equal to 0'),
   handleValidationErrors
]
//?---------------------------------------------------------------------

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


//?-------------FIND ALL PROPERTIES USER OWNS------------------------?//

router.get('/current',requireAuth,async(req,res,next) => {
   const currUser = req.user.id;
   // console.log(ownerId,"<--------------owner Id");




      const properties = await Spot.findAll({
         where:{
            ownerId: currUser
      }
   })

if(!properties){
   res.json('You do not have any properties listed')
}else{
   const all =[];
   for (let i = 0; i < properties.length;i++){
      const spot = properties[i];
      all.push({
         id: spot.id,
         ownerId: spot.ownerId,
      address: spot.address,
      city:spot.city,
      state:spot.state,
      country: spot.country,
      lat:spot.lat,
      lng:spot.lng,
      name:spot.name,
      description:spot.description,
      price:spot.price,
      createdAt:spot.createdAt,
      updatedAt: spot.updatedAt,
      numReviews: spot.numReviews,
      avgRating:spot.avgRating,
   previewImage: spot.previewImage})
   }
    res.json({Spots: all})
}

   }
)

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

if(!property){
   const err =new Error('Spot couldn\'t be found');
   err.status = 404;
   err.message = 'Spot couldn\'t be found';
   next(err)
}

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
      [{
      model: Image,
      as: 'SpotImages',
      where:{
         // imageableId: id,
         imageableType: 'Spot',
      },
      attributes:['id','url','preview']
   },
    {
      model: User,
      as: 'Owner',
      attributes: ['firstName','lastName'],
   }]
)
   });


   if(!location){
      const err = Error('Spot couldn`t be found');
      err.status = 404;
      err.title = 'Spot not found'
      err.message= 'Spot couldn`t be found'
      next(err)
   }else{
// const all=[];
// for(let i=0;i <location.length;i++){
//    const spot = location[i];
   const reviews = await Review.findAll({
      where: {
         spotId: id
      }
   });
   location.numReviews = reviews.length;
//    all.push({
//       id: spot.id,
//    ownerId: spot.ownerId,
// address: spot.address,
// city:spot.city,
// state:spot.state,
// country: spot.country,
// lat:spot.lat,
// lng:spot.lng,
// name:spot.name,
// description:spot.description,
// price:spot.price,
// createdAt:spot.createdAt,
// updatedAt: spot.updatedAt,
// numReviews: spot.numReviews,
// avgRating:spot.avgRating,
// SpotImages: spot.SpotImages})
// }
      res.json(  { id: location.id,
         ownerId: location.ownerId,
      address: location.address,
      city:location.city,
      state:location.state,
      country: location.country,
      lat:location.lat,
      lng:location.lng,
      name:location.name,
      description:location.description,
      price:location.price,
      createdAt:location.createdAt,
      updatedAt: location.updatedAt,
      numReviews: location.numReviews,
      avgRating:location.avgRating,
      SpotImages: location.SpotImages})
   }
});








//?---------------------GET ALL SPOTS--------------------------------?//
router.get('/',ValidateQueries,async (req,res)=>{
   const {minLat,maxLat,minLng,maxLng,minPrice,maxPrice} = req.query;
   let {page,size} = req.query
if(page || size || minLat || maxLat || minLng || maxLng || minPrice || maxPrice){
   const pagination = {}
   if(!page){
      page =1
   }
   if(!size){
      size = 10
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
      pagination.offset = Math.ceil(size * (page -1))
   }


   // let query = {}

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
   if(!result.count){
      res.json('No results')
   }
   result.rows = await Spot.findAll({where,include:{model:Image,as:'SpotImages'},limit: pagination.limit, offset:pagination.offset })
   const theCount = result.rows
if(theCount === 0){
   res.json(result.count)
}
// console.log(theCount.length)
   result.page = page || 1;
   result.size =theCount.length

// console.log(result)
   // const filtered = await allSpots.rows.findAll(
      // )
      const all =[]
      for(let i = 0; i < result.rows.length;i++){
         const spot = result.rows[i]
         id = result.rows[i].id;
         const avg = await getAvg(id);
         result.rows[i].avgRating = avg;
         const image = await Image.findOne({
            where:{
   imageableId: id,
   imageableType: 'Spot',
   preview:true
            },
            attributes: ['url']
         });
         // console.log(image)
all.push({
   id: spot.id,
ownerId: spot.ownerId,
address: spot.address,
city:spot.city,
state: spot.state,
country: spot.country,
lat:spot.lat,
lng:spot.lng,
name:spot.name,
description:spot.description,
price:spot.price,
createdAt:spot.createdAt,
updatedAt: spot.updatedAt,
avgRating:spot.avgRating,
previewImage: spot.previewImage})
      }
      res.json({
         // Spots: result.rows,
         Spots: all,
         page: result.page,
         size: result.size},)
      // }
   }else {
   const allSpots = await Spot.findAll();
   // console.log(allSpots)
   const all = [];
   for(let i = 0; i < allSpots.length;i++){
      const spot = allSpots[i]
      id = allSpots[i].id;
      all.push({
         id: spot.id,
      ownerId: spot.ownerId,
   address: spot.address,
   city:spot.city,
   state: spot.state,
   country: spot.country,
   lat:spot.lat,
   lng:spot.lng,
   name:spot.name,
   description:spot.description,
   price:spot.price,
   createdAt:spot.createdAt,
   updatedAt: spot.updatedAt,
   avgRating:spot.avgRating,
   previewImage: spot.previewImage})
      const avg = await getAvg(id);
      const image1 = await Image.findOne({
         where:{
imageableId: id,
imageableType: 'Spot',
preview:true
         },
         attributes: ['url']
      });
      // console.log(image)
      if(image1){
         await allSpots[i].update({
            avgRating: avg,
            previewImage: image1.url
         })
      }else{
         await allSpots[i].update({
            avgRating: avg
         });

      }
      // console.log(image)
      allSpots[i].avgRating = avg;

   };
// console.log(allSpots)
   res.json({Spots:
    all})
}

      });

//?----------------------------ADD SPOT------------------------------?//
//&--------------------     fixed this bug   ------------------------?//
router.post('/',requireAuth,validateSpot,async(req,res,next) =>{
   const {address,city,state,country,lat,lng,name,description,price} = req.body
   // console.log(address,'<-------address');
   // console.log(city,'<-------city');
   // console.log(country,'<-------country');
   // console.log(lat,'<-------latitude');
   // console.log(lng,'<-------longitude');
   // console.log(name,'<-------name');
   // console.log(description,'<-------description');
   // console.log(price,'<-------price');
const ownerId = req.user.id;
if(!ownerId){

}
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

   res.json({
      id: newSpot.id,
      ownerId: newSpot.ownerId,
      address: newSpot.address,
   city: newSpot.city,
state: newSpot.city,
state:newSpot.state,
country: newSpot.country,
lat: newSpot.lat,
lng: newSpot.lng,
name: newSpot.name,
description:newSpot.description,
price: newSpot.price,
createdAt: newSpot.createdAt,
updatedAt: newSpot.updatedAt})

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
const theSpot = await Spot.findByPk(id)

if(theSpot){
   if(req.user.id === theSpot.ownerId){
      await theSpot.destroy();
      res.json({message:'Successfully deleted'})
   }else{
      const err = new Error('Forbidden');
      err.status = 403;
      err.message = 'Forbidden'
      next(err)
   }
}else{
   const err = new Error('Spot not found');
   err.message = 'Spot not found',
   err.status = 400
   next(err)
}

})

//?---------------EDIT A SPOT PUT ROUTES----------------------------//?


router.put('/:spotId',requireAuth,validateSpot,async(req,res,next)=>{
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

   const err = Error('Forbidden')
   err.status=400;
   err.title='Forbidden';
   err.message='Forbidden';
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



   res.json({
      id: location.id,
      ownerId: location.ownerId,
      address: location.address,
        city: location.city,
        state: location.state,
        country: location.country,
        lat: location.lat,
        lng: location.lng,
        name: location.name,
        description: location.description,
        price: location.price,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt
   })

}


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

      const locationReviews = await Review.findAll({
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


      return res.json({Reviews: locationReviews})
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
   const reviewCheck = await Review.findAll({
      where: {
         spotId: spotId,
         userId: req.user.id
      }
   });
   if(reviewCheck.length){
      const err = new Error('User already has a review for this spot');
      err.status = 500;
      err.message ='User already has a review for this spot'
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
   res.json({
      id: newReview.id,
      userId: newReview.userId,
      spotId: newReview.spotId,
      review: newReview.review,
      stars: newReview.stars,
      createdAt: newReview.createdAt,
      updatedAt: newReview.updatedAt
   })
   }

}

})


//?------------------GET ALL BOOKINGS FOR SPOT BY ID--------------------


router.get('/:spotId/bookings',requireAuth,async (req,res,next)=>{
   const {spotId} = req.params;

   //& check for location
   const checking = await Spot.findOne({
      where: {
         id: spotId
      }
   });

//& err if not found
   if(!checking){
      const err = new Error('Spot couldn\'t be found');
      err.status = 400;
      err.message = 'Spot couldn\'t be found';
      next(err)
   }else{

      //& check if curr user is the owner of property
      console.log(req.user.id)
      console.log(checking.ownerId,"<==============owner")
      if(req.user.id === checking.ownerId){

         //& get all the bookings for that location
         // const location = await Booking.findAll({
         // where:{
         //    spotId: spotId
         // },
         // include:{model: User,
         // attributes:['id','firstName','lastName']}
         // })

         const theBooks = await Booking.findAll({
            where:{
               spotId: spotId
            },
            attributes:['id','spotId','userId','startDate','endDate','createdAt','updatedAt'],
         include: [{model: User,
         attributes: ['id','firstName','lastName']},
         {model: Spot,
         attributes:['id','ownerId','address','city','state','lat','lng','name','price','previewImage']}]
         })
   const final = []
         theBooks.forEach(booking=>{
   const curr =booking.toJSON()
   // console.log(booking)
   const constructed = {
   User: curr.User,
   id: curr.id,
   spotId: curr.spotId,
   userId: curr.userId,
   startDate: curr.startDate,
   endDate: curr.endDate,
   createdAt: curr.createdAt,
   updatedAt: curr.updatedAt
   };
   final.push(constructed)
         })

   // console.log(theBooks.id)
         res.json({Bookings: final})

      }else{
         const theBooks = await Booking.findAll({
            where:{
               spotId: spotId
            },

            attributes:['spotId','startDate','endDate'],
         });
         // const {startDate,endDate} = theBooks
         // console.log(theBooks.spotId = spotId)
         // console.log(theBooks)

         res.json({Bookings: theBooks
         })

   }
   }




})


//?--------------------------CREATE A BOOKING FROM THE SPOT ID--------------------------------
router.post('/:spotId/bookings',requireAuth,validateDates,async(req,res,next) => {
   const {spotId}= req.params;
   const id = Number(spotId);
//    // console.log(id)
let {startDate,endDate} = req.body;

      // //TODO this checks if the spot is valid
      const location = await Spot.findOne({
         where:{
            id: spotId
         }
      });
         //& if there is no location throw the not found err
      if(!location){
      const err = new Error('Spot couldn\'t be found');
      err.status = 404;
      err.message = 'Spot couldn\'t be found'
      next(err)

         }else
       if(req.user.id !== location.ownerId){

//                                //TODO this is pulling all curr bookings for the location
                  const bookings = await Booking.findAll({where: {spotId:location.id},
                  attributes: ['id','spotId','userId', 'startDate', 'endDate','createdAt','updatedAt']});


//           // console.log(bookings,"bookings----------");

//           //TODO this turns bookings into a JSON obj and pushed it to all
                               const all = []
                              bookings.forEach(current => {
                              const newCurrent = current.toJSON();
          // console.log(current.id,"this is the current")
                              all.push(newCurrent)
                              });
//                     //!----------------------
//                     //TODO if all has data loop through looking for bookings in particular? why tho? you do this with the bookings, each booking is all[i]
//                      //!----------------------
             if(all.length){

                  for(let i = 0; i < all.length; i++){

                         const stay = all[i]

//                              //TODO-----sets the date attribute to the values pulled in query
            const begin = new Date(startDate);
            const end = new Date(endDate);
//             // console.log(begin,'<----------------begin');
//             // console.log(end,'<----------------end');
//             // console.log(stay.startDate,"-------stay start")

            if(begin  < stay.startDate && stay.endDate < end || stay.startDate < begin && end < stay.endDate){
               const err = new Error('Sorry, this spot is already booked for the specified dates');
               err.status = 403;
               err.message = 'Sorry, this spot is already booked for the specified dates'
               err.errors ={
                  startDate: 'Start date conflicts with an existing booking',
                  endDate: 'endDate date conflicts with an existing booking'
               };
               return next(err)
            } //^checks the in between bookings
//             //TODO  this is checking if current booking start date lands in proposed new booking start date
             if(stay.startDate <= begin && stay.endDate >= begin){

                    const err = new Error('Sorry, this spot is already booked for the specified dates');
                    err.status = 403;
                    err.message = 'Sorry, this spot is already booked for the specified dates'
                    err.errors ={
                    startDate: 'Start date conflicts with an existing booking'
                   }
                        return next(err)
                        }
                        //& end of startDate check

//                                     //TODO this checks the new booking end date against current booking end date.
//                                     //~ make sure you are checking the proposed end date against the end date as well as the START date
                         if(stay.startDate <= end && stay.endDate >= end){
                         const err = new Error('Sorry, this spot is already booked for the specified dates');
                         err.status = 403;
                         err.message = 'Sorry, this spot is already booked for the specified dates'
                         err.errors ={
                           endDate: 'endDate date conflicts with an existing booking'
                           };
                                  return next(err)
          }
           //& end of endDate check


       }
        //& end of the for loop checking all bookings;


//         //TODO this pulls all users bookings
        const userBookings = await Booking.findAll({
          where: {
          userId: location.ownerId
          }
         });


//                                         //TODO put it into JSON
          const user= [];
          userBookings.forEach(booking =>{
           const newBooking = booking.toJSON();
            user.push(newBooking)
            });


            if(user.length){
                //TODO if bookings found loop through them and check like above

                    for(let i = 0; i < user.length; i++){

                  const stay = user[i]

//                                 //TODO-----sets the date attribute to the values pulled in query
                        const begin = new Date(startDate);
                         const end = new Date(endDate);

                         if(begin  < stay.startDate && stay.endDate < end || stay.startDate < begin && end < stay.endDate){
                           const err = new Error('Sorry, this spot is already booked for the specified dates');
                           err.status = 403;
                           err.message = 'Sorry, this spot is already booked for the specified dates'
                           err.errors ={
                              startDate: 'Start date conflicts with an existing booking',
                              endDate: 'endDate date conflicts with an existing booking'
                           };
                           return next(err)
                        }
//                    //TODO  this is checking if current booking start date lands in proposed new booking start date
            if(stay.startDate <= begin && stay.endDate >= begin){

             const err = new Error('Sorry, this spot is already booked for the specified dates');
               err.status = 403;
               err.message = 'Sorry, this spot is already booked for the specified dates'
               err.errors ={
               startDate: 'Start date conflicts with an existing booking'
                }
                  return next(err)
            }//& end of startDate check

//          //TODO this checks the new booking end date against current booking end date.


//    //~ make sure you are checking the proposed end date against the end date as well as the START date
if(stay.startDate <= end && stay.endDate >= end){
   const err = new Error('Sorry, this spot is already booked for the specified dates');
   err.status = 403;
   err.message = 'Sorry, this spot is already booked for the specified dates'
   err.errors ={
      endDate: 'endDate date conflicts with an existing booking'
   };
   return next(err)
              } //& end of endDate check
              }
 //& end of the for loop checking user bookings;
              }
//& end of bookings checks for user
      }
      const newBooking = await Booking.create({
         startDate,
         endDate,
         spotId:id,
         userId: req.user.id
      });
      const found = await Booking.findOne({
        where: { startDate: newBooking.startDate,
         endDate: newBooking.endDate,
         spotId: newBooking.spotId,
         userId: newBooking.userId},
         attributes: ['id','spotId','userId', 'startDate', 'endDate','createdAt','updatedAt']
      })
//       // console.log()

      return res.json({
         id:found.id,
      spotId:found.spotId,
   userId:found.userId,
   startDate: found.startDate,
   endDate: found.endDate,
   createdAt: found.createdAt,
   updatedAt:found.updatedAt})



   }else{
      const err = new Error('Forbidden');
      err.status =403;
      err.message = 'Forbidden';
      next(err)
   }




});




















module.exports = router;
