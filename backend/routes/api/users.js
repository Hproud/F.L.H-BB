const express = require('express');
const bcrypt= require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors}= require('../../utils/validation')
const {setTokenCookie, requireAuth} = require('../../utils/auth');
const {User} = require('../../db/models')
// const {Op} = require('sequelize')
const router = express.Router();

const validateSignUp = [
    check('firstName')
    .exists({checkFalsy: true})
    .withMessage('First Name is required.'),
    check('lastName')
    .exists({checkFalsy: true})
    .withMessage('Last Name is required.'),
    check('email')
    .isEmail()
    .withMessage('Invalid email.'),
    check('username')
    .exists({ checkFalsy: true})
    .isLength({min: 4})
    .withMessage('Username is required.'),
    check('username')
    .not()
    .isEmail()
    .withMessage('Username is required.'),
    check('password')
    .exists({ checkFalsy: true })
    .isLength({min: 6 })
    .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
];


router.post('/', validateSignUp, async (req,res,next)=>{
    const {email, password, username, firstName, lastName} = req.body;
    const hashedPassword = bcrypt.hashSync(password);

    const isEmail = await User.findOne({
        where:{
            email: email,
        }
    });
    const isusername = await User.findOne({
        where:{
            username: username
        }
    });

if(isEmail){
        const err = new Error('User already exists');
         err.status = 500
         err.errors = {
        email: 'User with that email already exists',
         }
        next(err)
    }else if(isusername){
            const err = new Error('User already exists');
            err.status = 500
            err.errors = {
                 username: 'User with that username already exists'
            }
            next(err)



}else{

    //? if(people){
    //?     const err = new Error('User already exists');
    //?     err.status = 500
    //?     err.errors = {
    //?         email: 'User with that email already exists',
    //?         username: 'User with that username already exists'
    //?     }
    //?     next(err)
    //? }else{
       const user = await User.create({firstName,lastName,email,username,hashedPassword});

             const safeUser = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                username: user.username,
            };

            await setTokenCookie(res, safeUser);

            return res.json({
                user:safeUser,
            })
        // ?};
}






}
)

module.exports = router;
