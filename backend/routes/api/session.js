const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie,restoreUser} =require('../../utils/auth');
const {User} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateLogin = [
    check('credential')
      .exists({checkFalsy:true})
      .notEmpty()
      .withMessage('Email or username is required.'),
    check('password')
      .exists({checkFalsy:true})
      .withMessage('Password is required.'),
    handleValidationErrors
  ];



router.post('/', validateLogin, async (req,res,next) => {
    // console.log(req.body)
const {credential, password} = req.body;
if(!credential || ! password){
    const err = new Error('Bad Request');
    err.errors = { credential: ' Email or username is required.',
password: 'Password is required'};
next(err)
}
const user = await User.unscoped().findOne({
    where: {
        [Op.or]: {
            username: credential,
            email: credential
        }
    }
});

if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())){
    const err = new Error("Invalid credentials");
    err.status = 401;

    return next(err);
}
const safeUser = {
    id: user.id,
    email: user.email,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName
};

await setTokenCookie(res, safeUser);

return res.json({
    user: {
        id: safeUser.id,
        firstName: safeUser.firstName,
        lastName: safeUser.lastName,
        email: safeUser.email,
        username: safeUser.username
    }
})
}
);

router.delete('/',(_req,res) => {

    res.clearCookie('token');

    return res.json({ message: 'success'})
});

router.get('/',
async(req,res) =>{
    const { user } = req;
    if (user) {
        const safeUser = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
        };

        return res.json({
            user: safeUser
        })
    }else{
        return res.json({user: null})
    }
})


module.exports = router;
