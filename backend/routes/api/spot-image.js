const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Booking,User,Review,Image} = require('../../db/models');
// const { validationResult } = require('express-validator');


const router = express.Router()

//?----------------------DELETE A SPOT IMAGE----------------------------
router.delete('/:imageId',requireAuth,async (req,res,next)=>{
    // console.log(req.params.imageId,"this is the id")
    const imageInQ = await Image.findOne({
        where: {
            id: Number(req.params.imageId),
            imageableType: 'Spot'
        },
        include: {model: Spot, as: 'spotImages'}
    })

    if(!imageInQ){
        const err = new Error('Spot Image couldn\'t be found');
        err.status = 404;
        err.message = 'Spot Image couldn\'t be found';
        next(err)
    };
    
const owner= Number(imageInQ.spotImages.ownerId)
// console.log(imageInQ.spotImages.ownerId,"<---------------------owner")
if(owner !== req.user.id){
    const err = new Error('Forbidden');
    err.message = 'Forbidden';
    err.status = 404;
    next(err)
}else{
    imageInQ.destroy();

    res.json('Successfully deleted')
}


})

module.exports = router;
