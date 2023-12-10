const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Booking,User,Review,Image} = require('../../db/models');
// const { validationResult } = require('express-validator');


const router = express.Router()

//?----------------------DELETE REVIEW IMAGE BY ID--------------

router.delete('/:imageId',requireAuth,async (req,res,next)=>{
    // console.log(req.params.imageId,"this is the id")
    const imageInQ = await Image.findOne({
        where: {
            id: Number(req.params.imageId),
            imageableType: 'Review'
        },
        attributes:['id','imageableId','imageableType']
    })

       if(!imageInQ){
        const err = new Error('Review Image couldn\'t be found');
        err.status = 404;
        err.message = 'Review Image couldn\'t be found';
        next(err)
    };

        const review = await Review.findOne({
            where: {
                id: imageInQ.imageableId
            },

        });


        console.log(review.userId)
     
if(review.userId !== req.user.id){
    const err = new Error('Forbidden');
    err.message = 'Forbidden';
    err.status = 403;
    next(err)
}else{
    imageInQ.destroy();

    res.json('Successfully deleted')
}

})







module.exports = router;
