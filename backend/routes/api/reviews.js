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

                imageableId: req.user.id,
                imageableType: 'Review'

        },
    as: 'ReviewImages'}]
})

if(!theReview){
    const err = new Error('Review couldn\'t be found');
    err.status = 404;
    err.message = 'Review couldn`t be found'
}else{

// console.log(req.user.id)
// console.log(theReview)
if(req.user.id !== theReview.userId){
    const err = new Error('You can only add pictures to reviews you have written');
    err.title = 'Forbidden';
    err.message = 'You can only add pictures to reviews you have written'
    next(err)
}else{

    // console.log(theReview.ReviewImages.length,'iiuiuiuiuiuiuiu')
    if(theReview.ReviewImages.length === 10){
        const err = new Error('Maximum number of images for this resource was reached');
        err.status = 403;
        err.message = 'Maximum number of images for this resource was reached';
        next(err)
    }else{
        const reviewPic = await Image.create({
            imageableId: req.user.id,
            imageableType: 'Review',
            url: url,
            preview: false
        })
await theReview.update({
    ReviewImages: reviewPic,
    where:{
        id: theReview.id
    }
}
)


        res.json({
            id: reviewPic.id,
            url: reviewPic.url
        })
    }
    }


}

})

//?---------------------UPDATE REVIEW PUT/PATCH-------------------------
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
        err.status = 401;
        err.message = 'Cannot edit someone else\'s review';
        next(err)
    }else{
         const edited = await needsUpdated.update({
            review: review,
            stars: stars,
        },
        );

        return res.json(edited)
    }
    });



//^-------------------------------------------------------------------
router.patch('/:reviewId',requireAuth,validateReview,async(req,res,next)=>{
    const {reviewId} = req.params;
    const {review,stars} = req.body
    const needsUpdated = await Review.findOne({
        where:{
            id: reviewId
        }
    });

    if(!needsUpdated){
        const err = new Error('Review couldn\'t be found');
        err.status =400;
        err.message = 'Review couldn\'t be found'
        next(err)
    };

     if(req.user.id !== needsUpdated.userId){
        const err = new Error('Forbidden');
        err.status = 401;
        err.message = 'Cannot edit someone else\'s review';
        next(err)
    }else{
         const edited = await needsUpdated.update({
            review: review,
            stars: stars,
        },
        );

        return res.json(edited)
    }
    });

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
    err.status = 401;
    err.message = 'Forbidden';
    next(err)
}else{
    await votedOff.destroy();

    res.json('Successfully deleted')
}




})

module.exports = router;
