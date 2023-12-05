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
        include:{
            model: Spot,
        attributes:['id','ownerId','address','city','state','lat','lng','name','price','previewImage']
        }
    });
    // console.log(myBookings.spot.id,'aklsdjf;klajsdhfkjashdfkjhasdkljfhaksljdfhakjlshdfkjashdfkahsdkfjhaskljdfhlks')


    // console.log(myBookings.id)

   res.json({Bookings: {
        id: myBookings.id,
        spotId: myBookings.spotId,
        spot: myBookings.spot,
    userId: myBookings.userId,
startDate: myBookings.startDate,
endDate: myBookings.endDate,
createdAt: myBookings.createdAt,
updatedAt: myBookings.updatedAt
}
})
})

//? --------------------------EDIT A BOOKING---------------------------

router.put('/:bookingId',requireAuth,validateDates,async (req,res,next) => {
    const {bookingId} = req.params;
    const {startDate,endDate} = req.body;

    const reservation = await Booking.findOne({
        where:{
            id: bookingId
        }
    });

    if(!reservation){
        const err = new Error('Booking couldn\'t be found');
        err.status = 404;
        err.message = 'Booking couldn\'t be found'
        next(err)
    }else{
        const today = new Date();
        const start = new Date(reservation.startDate);
        // const end = new Date(reservation.endDate)

        if(start < today){
            const err = new Error('Past bookings can\'t be modified');
            err.status = 403;
            err.message ='Past bookings can\'t be modified';
            next(err)
        }
await reservation.update({
    startDate,
    endDate
})
return res.json(reservation)
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
