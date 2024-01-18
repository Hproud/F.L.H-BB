const express = require('express');
const router = express.Router();
const apiRouter = require('./api');
const sessionRouter = require('./api/session.js');
const usersRouter = require('./api/users.js')
 const { restoreUser } = require('../utils/auth.js');


router.use(restoreUser);

router.use('/session',sessionRouter);

router.use('/users',usersRouter);

router.post('test',(req,res) =>{
    res.json({ requestBody: req.body})
})

router.get('/api/csrf/restore',(req,res) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN',csrfToken);
    res.status(200).json({
        'XSRF-Token' : csrfToken
    })
});

router.use('/api',apiRouter);

if (process.env.NODE_ENV === 'production') {
    const path = require('path');



    router.get('/', (req, res) => {
        res.cookie('XSRF-TOKEN', req.csrfToken());
        return res.sendFile(
            path.resolve(__dirname, '../../frontend', 'dist', 'index.html')
            );
        });


        router.use(express.static(path.resolve("../frontend/build")));


        router.get(/^(?!\/?api).*/, (req, res) => {
            res.cookie('XSRF-TOKEN', req.csrfToken());
            return res.sendFile(
                path.resolve(__dirname, '../../frontend', 'build', 'index.html')
                );
            });

            if (process.env.NODE_ENV !== 'production') {
                router.get('/api/csrf/restore', (req, res) => {
                  res.cookie('XSRF-TOKEN', req.csrfToken());
                  return res.json({});
                });
              }

  }

module.exports = router;
