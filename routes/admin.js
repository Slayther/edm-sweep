const express = require('express');
const router = express.Router();
const models = require('../models');
const passport = require('passport');
require('../auth');

/* GET home page. */
router.use( (req,res,next) =>{
    if(!req.user){
        // res.redirect('/');
        res.render('admin-login');
    }
    next();
});

// router.get('/login', (req,res) => {
//     res.render('admin-login');
// })

router.get('/portal', (req,res) =>{
    models.Contest.getContests()
        .then( (contestData) =>{
            res.render('admin', {contest:contestData})
        });
});

// router.get('/', function(req, res, next) {
//     // res.render('admin-login', {});
//     res.render('admin', {});
// });

router.post('/', passport.authenticate(
    'local',
    {
        successRedirect: '/admin/portal',

        failureRedirect: '/admin'
    })
);

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
    const endDate = req.body.endDate;
    const endTime = req.body.endTime;


    const editContest = new models.Contest({
        id: id,
        contestName: contestName,
        contestLink: contestLink,
        endDate: endDate,
        endTime: endTime
    });
    editContest.editTodB();
    res.send('hello from edit-post');
})

router.post('/new-post', (req,res) =>{
    const contestName = req.body.contestName;
    const contestLink = req.body.contestLink;
    const endDate = req.body.endDate;
    const endTime = req.body.endTime;


    const newContest = new models.Contest({
        contestName: contestName,
        contestLink: contestLink,
        endDate: endDate,
        endTime: endTime
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
