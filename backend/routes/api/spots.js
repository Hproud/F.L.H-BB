const express = require('express');
const bcrypt= require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {Spot,Review,Image,Booking} = require('../../db/models')

const router = express.Router();



router.get('/',async (req,res,next)=>{

    const allSpots = await Spot.findAll({
       include: {model: Review, attributes: ['stars'], }
    });
// console.log(allSpots,'this is all sports !!!!!!!!!');

res.json(allSpots)
})




module.exports = router;
