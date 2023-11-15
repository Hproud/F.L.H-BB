const express = require('express');
const { validationResult }= require('express-validator');


const handleValidationErrors = (req, _res, next)=>{
const validationsErrors = validationResult(req);

if (!validationsErrors.isEmpty()){
    const errors = {};
    validationsErrors.array().forEach(error =>
        errors[error.path] = error.msg
    );

    const err = Error('Bad request');
    err.errors = errors;
    err.status =400;
    err.title = 'Bad request.';
next(err)
};
next();
};



module.exports = {
    handleValidationErrors
};
