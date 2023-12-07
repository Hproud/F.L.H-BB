const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie,requireAuth} = require('../../utils/auth');
const {Spot,Booking,User,Review,Image} = require('../../db/models');
// const { validationResult } = require('express-validator');


const router = express.Router()



//?----------------------Validate review info---------------------------

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
                attributes: ['id','firstName','lastName']
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


const all = [];
for (let i = 0; i < myReviews.length;i++){
    const review = myReviews[i];
    all.push({
        id: review.id,
        userId: review.userId,
        spotId: review.spotId,
        review: review.review,
        stars: review.stars,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        User: review.User,
        Spot: review.Spot,
        ReviewImages: review.ReviewImages
    })
}



 return res.json({Reviews: all})
})


//? -------------ADD IMAGE TO REVIEW BASED ON REVIEWS ID----------------

router.post('/:reviewId/images',requireAuth, async (req,res,next)=> {
const {reviewId} = req.params;
const {url} = req.body
// console.log(id,'<--------------------------------ID')
const theReview = await Review.findOne({
    where:{
        id: reviewId
    },
    include: [{model:Image,
        where:{
                imageableId: reviewId,
                imageableType: 'Review'

        },
    as: 'ReviewImages'}]
});
// console.log(theReview)
if(!theReview){
    const err = new Error('Review couldn\'t be found');
    err.status = 404;
    err.message = 'Review couldn`t be found'
    next(err)
}

console.log(req.user.id)
console.log(theReview.userId)
if(req.user.id !== theReview.userId){
    const err = new Error('Forbidden');
    err.status = 403;
    err.message = 'Forbidden'
    next(err)
}else{
    console.log(theReview.ReviewImages.length)
if(theReview.ReviewImages.length === 10){
    const err = new Error('Maximum number of images for this resource was reached');
    err.status = 403;
    err.message = 'Maximum number of images for this resource was reached';
    next(err)
}else{
    const reviewPic = await Image.create({
        imageableId: theReview.id,
        imageableType: 'Review',
        url: url,
        preview: false
    })
await theReview.update({
ReviewImages: reviewPic}
)
res.json({
id: reviewPic.id,
url: reviewPic.url
});
}
}}

)

//?---------------------UPDATE REVIEW PUT-------------------------
router.put('/:reviewId',requireAuth,validateReview,async(req,res,next)=>{
    const {reviewId} = req.params;
    const {review,stars} = req.body
    const needsUpdated = await Review.findOne({
        where:{
            id: reviewId
        }
    });

    if(!needsUpdated){
        const err = new Error('Review couldn\'t be found');
        err.status =404;
        err.message = 'Review couldn\'t be found'
        next(err)
    };

     if(req.user.id !== needsUpdated.userId){
        const err = new Error('Forbidden');
        err.status = 403;
        err.message = 'Fobidden';
        next(err)
    }else{
         const edited = await needsUpdated.update({
            review: review,
            stars: stars,
        },
        );

        return res.json({id: edited.id,
        userId: edited.userId,
    spotId: edited.spotId,
review: edited.review,
stars: edited.stars,
createdAt: edited.createdAt,
updatedAt: edited.updatedAt
})
    }
    });



//?------------------DELETE A REVIEW--------------------------

router.delete('/:reviewId',requireAuth,async (req,res,next) => {
    const {reviewId} = req.params;
    const votedOff = await Review.findOne({
        where:{
            id: reviewId
        }
    });

    if (!votedOff){
        const err = new Error('Review couldn\'t be found');
        err.status = 404;
        err.message = 'Review couldn\'t be found';
        next(err)
    }

if(votedOff.userId !== req.user.id){
    const err= new Error('Forbidden');
    err.status = 403;
    err.message = 'Forbidden';
    next(err)
}else{
    await votedOff.destroy();

    res.json('Successfully deleted')
}




})

module.exports = router;
