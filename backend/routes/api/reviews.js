const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Booking,User,Review,Image} = require('../../db/models');
// const { validationResult } = require('express-validator');


const router = express.Router()


//?--------------------GET ALL REVIEWS OF CURR USER--------------------




//& does not work when including the images model? takes away spot and owner info is not including correctly either
//^to fix this we just needed to add brackets arount all the objects in the include clause.




router.get('/current',requireAuth,async(req,res,next)=> {
    const id = req.user.id;
// console.log(id,'<------------------------id')
    const myReviews = await Review.findAll({
        where: {
            userId: id
        },
        include: (
           [ {
                model: User,
                attributes: ['firstName','lastName']
            },
            {
                model: Spot,
                attributes: ['id','ownerId','address','city','state','country','lat','lng','name','price','previewImage']
            },
            {
                model: Image,
            as: 'ReviewImages',
                attributes: ['id','url'],
            }]
        )
    }
    );

 return res.json(myReviews)
})













module.exports = router;
