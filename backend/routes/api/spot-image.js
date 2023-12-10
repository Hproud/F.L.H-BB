const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Booking,User,Review,Image} = require('../../db/models');
// const { validationResult } = require('express-validator');


const router = express.Router()

//?----------------------DELETE A SPOT IMAGE----------------------------
router.delete('/:imageId',requireAuth,async (req,res,next)=>{
    // const {imageId} = req.params
    const picId = req.params.imageId
    // console.log(req.params.imageId,"this is the id")
    const imageInQ = await Image.findOne({
        where: {
            id: picId
        },
        include:{
            model: Spot,
        as: 'spotImages',


}});






// console.log(imageInQ.id,"=================================================================")

    if(!imageInQ){
        const err = new Error('Spot Image couldn\'t be found');
        err.status = 404;
        err.message = 'Spot Image couldn\'t be found';
        next(err)
    };

const owner= Number(imageInQ.spotImages.ownerId)
// console.log(imageInQ.spotImages.ownerId,"<---------------------owner")
if(imageInQ.spotImages.ownerId !== req.user.id){
    const err = new Error('Forbidden');
    err.message = 'Forbidden';
    err.status = 403;
    next(err)
}else{
    console.log(imageInQ.spotImages.id)
    if(imageInQ.spotImages.previewImage){
     const place = await Spot.findOne({
        where:{
            id: imageInQ.spotImages.id
        }
     });
 if(imageInQ.url === place.previewImage){
    place.previewImage = false
 }
 await place.save();
        console.log(place,'this is final')
    };
    imageInQ.destroy();

    res.json('Successfully deleted')
}


})

module.exports = router;
