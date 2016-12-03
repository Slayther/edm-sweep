//admin.js

// Requires =====================================
const express = require('express');
const passport = require('passport');
const router = express.Router();
const models = require('../models');
const sharp = require('sharp');
const stream = require('stream');
const multer = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images/uploads/contests/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg') //Appending .jpg
    }
})
const upload = multer({
    dest: './public/images/uploads/contests/'
});

// Routes =======================================
// Requires that user be logged in to see any content on this route
router.use( (req,res,next) =>{
    if(!req.user){
        console.log('redirecting to: ');
        res.redirect('/login');
        return;
    }
    next();
});

// *GET* Routes =======================================

router.get('/', (req,res) =>{

    res.render('admin');
})

router.get('/new-post', (req,res) => {
    console.log('test from new post')
    res.render('new-post');
});

router.get('/edit-post/:id', (req,res) => {
    const id = req.params.id;

    models.Contest.getContestById(id)
        .then( (contest) => {
            console.log(contest);
            res.render('edit-post', contest)
        });

});

router.get('/view-contact', (req,res) =>{
    models.Contact.getContact()
        .then( (contact) =>{
            res.render('view-contact', {contact: contact});
        });
})

router.get('/view-contact/:id', (req,res) =>{
    const id = req.params.id;
    models.Contact.getContactById(id)
        .then( (contact) =>{
            console.log(contact);
            res.render('view-contact-single', contact);
        });
})

// *POST* Routes =======================================
router.post('/edit-post/:id', (req,res) => {
    const id = req.params.id;
    const contestName = req.body.contestName;
    const contestLink = req.body.contestLink;
    const contestEnd = req.body.contestEnd;


    const editContest = new models.Contest({
        id: id,
        contestName: contestName,
        contestLink: contestLink,
        contestEnd: contestEnd
    });
    editContest.editTodB();
    res.redirect('/admin/portal');
})

router.post('/new-post', upload.single('contestImage'), (req,res) =>{
    console.log(req.body);
    const contestName = req.body.contestName;
    const contestLink = req.body.contestLink;
    const contestEnd = req.body.contestEnd;


    const newContest = new models.Contest({
        contestName: contestName,
        contestLink: contestLink,
        contestEnd: contestEnd
    });
    console.log(newContest);

    newContest.saveToDB();


    res.send('hello from post new-post');
})

// TESTING =================================================







module.exports = router;
