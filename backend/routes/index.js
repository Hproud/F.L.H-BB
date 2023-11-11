const express = require('express');
const router =express.Router();

router.get('/hello/world', function(req,res)=>{
res.cookie('XSRF-TOKEN',req.csurfToken());
res.send('Hellow World!');
});


module.exports = router;
