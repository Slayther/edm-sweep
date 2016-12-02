//admin.js

const express = require('express');
const router = express.Router();
const models = require('../models');
const passport = require('passport');
require('../auth');

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

router.use( (req,res,next) =>{
    if(!req.user){
        res.redirect('/login');
        return;
        // res.render('admin-login');
    }
    next();
});

router.use('/', (req,res) =>{
    res.render('admin');
})

// router.get('/', (req,res) => {
//     res.render('admin-login');
// })

// router.get('/portal', (req,res) =>{
//     models.Contest.getContests()
//         .then( (contestData) =>{
//             res.render('admin', {contest:contestData})
//         });
// });



router.get('/new-post', (req,res) => {
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

router.post('/new-post', (req,res) =>{
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






module.exports = router;
