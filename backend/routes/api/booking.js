const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Booking,User,Review,Image} = require('../../db/models');
// const { validationResult } = require('express-validator');


const router = express.Router()


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
    res.json({myBookings})
})





module.exports = router;
