//admin.js

// Requires =====================================
const express = require('express');
const passport = require('passport');
const router = express.Router();
const models = require('../models');
require('../auth');

// Routes =======================================

router.get('/', (req,res) => {
    res.render('admin-login');
});

// Checks to see if user successfully logged in with authentication
router.post('/', passport.authenticate(
    'local',
    {
        successRedirect: '/admin',

        failureRedirect: '/login',

        failureFlash: true
    })
);






module.exports = router;
