 const router = require('express').Router();
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewsRouter = require('./reviews.js');
const bookingRouter = require('./booking.js');
const spotImageRouter = require('./spot-image.js');
const reviewImageRouter = require('./review-image.js');
const { restoreUser } = require("../../utils/auth.js");


router.post('/test', function(req,res){
    res.json({ requestBody: req.body})
});
router.get('/set-token-cookie', async(_req,res) => {
    const user = await User.findOne({
        where: {
            username: 'Demo-lition'
        }
    });
    setTokenCookie(res,user);
    return res.json({user: user})
});
//
router.use(restoreUser);
router.get('/restore-user', (req, res) =>{
    return res.json(req.user)
})

router.use(restoreUser);

const { requireAuth} = require('../../utils/auth.js');

router.get(
    '/require-auth',
    requireAuth,
    (req, res) => {
      return res.json(req.user);
    }
  );

  router.use(restoreUser);

router.use('/session',sessionRouter);

router.use('/users',usersRouter);

router.use('/spots',spotsRouter);

router.use( '/reviews',reviewsRouter);

router.use('/bookings',bookingRouter);

router.use('/spot-images',spotImageRouter);

router.use('/review-images',reviewImageRouter);





router.post('/test',(req,res) =>{
    res.json({ requestBody: req.body})
})



module.exports = router;
