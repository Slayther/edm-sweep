//admin.js

// Requires =====================================
const express = require('express');
const passport = require('passport');
const router = express.Router();
const models = require('../models');
const path = require('path');
const stream = require('stream');
const multer = require('multer');
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, path.join(__dirname,'/../public/images/uploads/contests/'));
    },
    filename: function (req, file, cb) {
        console.log(file);
        console.log(req.file);
        cb(null, Date.now() + '.png' ) //Appending .png
    }
})

var upload = multer({
    storage: storage,
});

// Routes =======================================
// Requires that user be logged in to see any content on this route
// router.use( (req,res,next) =>{
//     if(!req.user){
//         console.log('redirecting to: ');
//         res.redirect('/login');
//         return;
//     }
//     next();
// });


// *GET* Routes =======================================
router.get('/', (req,res) =>{
    //Required database queries
    Promise.all( [
        models.Contest.getContests(),
        models.Contest.getOngoingContests(),
        models.Contact.getContact()
    ])
        .then( (array) =>{
            //define array output of queries
            let contests = array[0];
            let ongoingContests = array[1];
            let contacts = array[2];

            //filter to only show expired contests
            contests = contests.filter( (contest) =>{
                return contest.contestEnd < new Date();
            })

            //format date
            contests = contests.map( (contest) =>{
                contest.contestEnd = new Date(contest.contestEnd);
                return contest;
            });

            //result
            res.render('admin', {
                layout: './layouts/admin-layout',
                isadmin: 'active',
                contest: contests,
                contestCount: ongoingContests.length,
                contactCount: contacts.length
            });

        });
});

router.get('/new-post', (req,res) => {
    console.log('test from new post')
    res.render('new-post', {
        iscontest: 'active',
        layout: './layouts/admin-layout',
    });
});

router.get('/edit-post/:id', (req,res) => {
    const id = req.params.id;
    models.Contest.getContestById(id)
        .then( (contest) => {
            console.log(contest);
            res.render('edit-post', {
                contest,
                iscontest: 'active',
                layout: './layouts/admin-layout',
            })
        });

});

router.get('/view-post/:id', (req,res) => {
    const id = req.params.id;

    models.Contest.getContestById(id)
        .then((contest) => {
            res.render('view-post', {
                contest,
                title: 'View Post',
                iscontest: 'active',
                layout: './layouts/admin-layout',
            });
        });
});

router.get('/view-contact', (req,res) =>{
    models.Contact.getContact()
        .then( (contact) =>{
            res.render('view-contact', {
                contact: contact,
                iscontacts: 'active',
                layout: './layouts/admin-layout',
            });
        });
})

router.get('/view-contest', (req,res) =>{
    models.Contest.getContests()
        .then( (contest) =>{
            res.render('view-contest', {
                contest: contest,
                iscontest: 'active',
                layout: './layouts/admin-layout',
            });
        });
})

router.get('/view-contact/:id', (req,res) =>{
    const id = req.params.id;
    models.Contact.getContactById(id)
        .then( (contact) =>{
            res.render('view-contact-single', {
                contact: contact,
                iscontacts: 'active',
                layout: './layouts/admin-layout',

            });
        });
});

// *POST* Routes =======================================
router.post('/edit-post/:id', (req,res) => {
    const id = req.params.id;
    const contestName = req.body.contestName;
    const contestLink = req.body.contestLink;
    const contestEnd = req.body.contestEnd;
    const contestPath = (req.file.destination + req.file.filename)
    const contestImage = req.file.filename;



    const editContest = new models.Contest({
        id: id,
        contestName: contestName,
        contestLink: contestLink,
        contestEnd: contestEnd,
        contestImage: contestImage
    });
    console.log(editContest);
    editContest.editTodB();
    res.redirect('/admin/');
});

router.post('/new-post', upload.single('contestImage'), (req,res) =>{

    const contestName = req.body.contestName;
    const contestLink = req.body.contestLink;
    const contestEnd = Date.parse(req.body.contestEnd);
    const contestPath = (req.file.destination + req.file.filename)
    const contestImage = req.file.filename;

    const newContest = new models.Contest({
        contestName: contestName,
        contestLink: contestLink,
        contestEnd: contestEnd,
        contestImage: contestImage
    });
    console.log(newContest);

    newContest.saveToDB()
        .then( ()=>{
            res.redirect('/');
        });

});

// TESTING =================================================




// ==============================================================







module.exports = router;
