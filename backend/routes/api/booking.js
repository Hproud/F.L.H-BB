const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Booking,User,Review,Image} = require('../../db/models');
// const { validationResult } = require('express-validator');


const router = express.Router()

//?---------------------------------------------------------------------

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
//?-----------------GET ALL CURRENT USERS BOOKINGS----------------------
//& this route works but is not currently including the booking Id numbers in it?
//^DEBUG************************************************************************
router.get('/current',requireAuth,async(req,res,next) => {
    const user = req.user.id;

    const myBookings = await Booking.findAll({
        where: {
            userId: user
        },
        attributes:['id','spotId','userId','startDate','endDate','createdAt','updatedAt'],
        include:{
            model: Spot,
        attributes:['id','ownerId','address','city','state','lat','lng','name','price','previewImage']
        },
    });
    // console.log(myBookings.spot.id,'aklsdjf;klajsdhfkjashdfkjhasdkljfhaksljdfhakjlshdfkjashdfkahsdkfjhaskljdfhlks')
    const allBookings =[]
// const allBookings = []

myBookings.forEach(trip => {
    trip.toJSON();

    // console.log(trip.Spot.dataValues)
    const booking = {
        id: trip.id,
        spotId: trip.spotId,
        spot: trip.Spot.dataValues,
        userId: trip.userId,
        startDate: trip.startDate,
        endDate: trip.endDate,
        createdAt: trip.createdAt,
        updatedAt: trip.updatedAt
    }
allBookings.push(booking)
});
// console.log(book)
   res.json({
allBookings
   }

)
})

//? --------------------------EDIT A BOOKING---------------------------

router.put('/:bookingId',requireAuth,validateDates,async (req,res,next) => {
    const {bookingId} = req.params;
    const {startDate,endDate} = req.body;

    const reservation = await Booking.findOne({
        where:{
            id: bookingId
        },
        attributes:['id','spotId','userId','startDate','endDate','createdAt','updatedAt']
    });
// console.log(reservation.dataValues,'<----------------reservation');
// console.log(req.user.id)
    if(!reservation){
        const err = new Error('Booking couldn\'t be found');
        err.status = 404;
        err.message = 'Booking couldn\'t be found'
        next(err)
    }else{
        if(reservation.userId === req.user.id){

           const today = new Date();
        const start = new Date(reservation.startDate);
        const end = new Date(reservation.endDate)
        const newStart = new Date(req.body.startDate);
        const newEnd = new Date(req.body.endDate)

        if(start < today){
            const err = new Error('Past bookings can\'t be modified');
            err.status = 403;
            err.message ='Past bookings can\'t be modified';
            next(err)
        };


const allBookings = await Booking.findAll({
    where:{
        spotId: reservation.spotId,
    },
        attributes:['id','spotId','userId','startDate','endDate','createdAt','updatedAt']
});
// console.log(allBookings)


const all = []
allBookings.forEach(current => {
   const newCurrent = current.toJSON();
   if (newCurrent.id !== reservation.id){
    all.push(current)
   }
   // console.log(current.id,"this is the current")

});

if(all.length){
   for(let i = 0; i < all.length; i++){
      const stay = all[i]
      if(stay.id !== Number(bookingId)){
     const begin = new Date(startDate);
      const end = new Date(endDate);
      // console.log(begin,'<----------------begin');
      // console.log(end,'<----------------end');
if(stay.startDate <= begin && stay.endDate >= begin){

      const err = new Error('Sorry, this spot is already booked for the specified dates');
   err.status = 403;
   err.message = 'Sorry, this spot is already booked for the specified dates'
   err.errors ={
      startDate: 'Start date conflicts with an existing booking'
   }
   next(err)
   }
if(stay.startDate <= end && stay.endDate >= end){
   const err = new Error('Sorry, this spot is already booked for the specified dates');
   err.status = 403;
   err.message = 'Sorry, this spot is already booked for the specified dates'
   err.errors ={
      endDate: 'endDate date conflicts with an existing booking'
   };
   next(err)
}

      }

}



};



const user = [];
const userBooking = await Booking.findAll({
    where: {
        userId: reservation.userId
    },
    attributes:['id','spotId','userId','startDate','endDate','createdAt','updatedAt']
});

// console.log(userBooking,"---------------")
userBooking.forEach(record =>{
    const booking = record.toJSON();
        user.push(booking)

});

// console.log(user,"------------user-----------")

if(user.length){
    for(let i = 0; i < user.length; i++){
        const stay = user[i]
if(user[i].id !== reservation.id){
console.log(stay.id," this  is  the  stay  id");
console.log(reservation.id,"res id ++++++++++++++++++++++++++++")

    // console.log(req.params.bookingId,"booking being edited===============")
const begin = new Date(startDate);
const end = new Date(endDate);
console.log(begin,'<----------------begin');
console.log(end,'<----------------end');
console.log(stay.startDate,"=============bking start");
console.log(stay.endDate,"=============bking end")

if(stay.startDate <= begin && stay.endDate >= begin){

const err = new Error('Sorry, this spot is already booked for the specified dates');
err.status = 403;
err.message = 'Sorry, this spot is already booked for the specified dates'
err.errors ={
startDate: 'Start date conflicts with an existing booking'
}
next(err)
}
if(stay.startDate <= end && stay.endDate >= end){
const err = new Error('Sorry, this spot is already booked for the specified dates');
err.status = 403;
err.message = 'Sorry, this spot is already booked for the specified dates'
err.errors ={
endDate: 'endDate date conflicts with an existing booking'
};
next(err)
}

}
  }

}



await reservation.update({
    startDate,
    endDate
})
return res.json({
    id:reservation.id,
    spotId: reservation.spotId,
    userId: reservation.userId,
    startDate: reservation.startDate,
    endDate: reservation.endDate,
    createdAt: reservation.createdAt,
    updatedAt: reservation.updatedAt
})
    }else{
        const err = new Error('Forbidden');
        err.status = 403;
        err.message = 'Forbidden'
        next(err)
    }
        }


});


//?------------------------DELETE A BOOKING-----------------------------

 router.delete('/:bookingId',requireAuth,async (req,res,next) => {
    const {bookingId} = req.params;

    const reservation = await Booking.findOne({
        where: {
            id: bookingId
        }
    });
    if (!reservation){
        const err = new Error('Booking couldn\'t be found');
        err.status = 404;
        err.message = 'Booking couldn\'t be found'
        next(err)
    }else{
        if(reservation.userId !== req.user.id){
            const err = new Error('Forbidden');
            err.status = 403;
            next(err);
        };
        // console.log(new Date(reservation.startDate))
        const start = new Date(reservation.startDate);
        const today = new Date()
if(start < today){
    const err = new Error('Bookings that have been started can\'t be deleted');
    err.status = 403;
    err.message='Bookings that have been started can\'t be deleted';
    next(err)
}else{
    await reservation.destroy();
    res.json('Successfully deleted')
}

    }
 })

module.exports = router;
