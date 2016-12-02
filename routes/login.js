//admin.js

const express = require('express');
const router = express.Router();
const models = require('../models');
const passport = require('passport');
require('../auth');

router.get('/', (req,res) => {
    res.render('admin-login');
})

router.use( (req,res,next) =>{
    if(!req.user){
        res.redirect('/login');
        return;
        // res.render('admin-login');
    }
    next();
});



router.post('/', passport.authenticate(
    'local',
    {
        successRedirect: '/admin/portal',

        failureRedirect: '/login',

        failureFlash: true
    })
);






module.exports = router;
