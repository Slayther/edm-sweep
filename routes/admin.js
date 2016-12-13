//admin.js

// Requires =====================================
const express = require('express');
const passport = require('passport');
const router = express.Router();
const models = require('../models');
// const sharp = require('sharp');
const stream = require('stream');
// const crop = require('cropit');
const multer = require('multer');
// require('cropit');
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, '/home/amazecpk/web/edm-sweep/public/images/uploads/contests/')
    },
    filename: function (req, file, cb) {
        console.log(file);
        console.log(req.file);
        cb(null, Date.now() + '.png' ) //Appending .jpg
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
// router.get('/', (req,res) =>{
//
//     // Promise.all( [
//     //     models.Contest.getContests(),
//     //     models.Contest.getOngoingContests(),
//     //     models.Contact.getContact()
//     // ])
//     //     .then( (array) =>{
//     //         let contests = array[0];
//     //         let ongoingContests = array[1];
//     //         let contacts = array[2];
//     //         console.log(contacts);
//     //     });
//
//
//     models.Contest.getContests()
//     // models.Contest.getOngoingContests()
//         .then( (contests) =>{
//
//             contests = contests.map( (contest) =>{
//                 contest.contestEnd = new Date(contest.contestEnd);
//                 return contest;
//             })
//
//             const contestCount = contests.filter( (contest) =>{
//                 return contest.contestEnd > new Date();
//             }).length;
//
//             res.render('admin',{
//                 layout: './layouts/admin-layout',
//                 isadmin: 'active',
//                 contest: contests,
//                 contestCount: contestCount
//             });
//         });
// });

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
    console.log(contestName);
    console.log(contestLink);
    console.log(contestEnd);


    const editContest = new models.Contest({
        id: id,
        contestName: contestName,
        contestLink: contestLink,
        contestEnd: contestEnd
    });
    console.log(editContest);
    editContest.editTodB();
    res.redirect('/admin/');
})
// router.post('/new-post', upload.single('contestImage'), (req,res) =>{
// // router.post('/new-post', (req,res) =>{
// //     console.log(req.file.mimeType);
//
//     const contestName = req.body.contestName;
//     const contestLink = req.body.contestLink;
//     const contestEnd = req.body.contestEnd;
//     const contestImage = req.body.contestImage;
//
//     const newContest = new models.Contest({
//         contestName: contestName,
//         contestLink: contestLink,
//         contestEnd: contestEnd,
//         contestImage: contestImage
//     });
//     console.log(newContest);
//
//     // newContest.saveToDB();
//
//
//     res.send('hello from post new-post');
// })

// TESTING =================================================

router.post('/new-post', upload.single('contestImage'), (req,res) =>{
    // console.log(req.file.mimeType);
    // console.log('file: '+req.file);

    const contestName = req.body.contestName;
    const contestLink = req.body.contestLink;
    const contestEnd = req.body.contestEnd;
    const contestPath = (req.file.destination + req.file.filename)
    const contestImage = contestPath.slice(8)

    const newContest = new models.Contest({
        contestName: contestName,
        contestLink: contestLink,
        contestEnd: contestEnd,
        contestImage: contestImage
    });
    // console.log(newContest);

    newContest.saveToDB()
        .then( ()=>{
            res.redirect('/');
        });

});


// ==============================================================

router.get('/', (req,res) =>{

    Promise.all( [
        models.Contest.getContests(),
        models.Contest.getOngoingContests(),
        models.Contact.getContact()
    ])
        .then( (array) =>{
            let contests = array[0];
            let ongoingContests = array[1];
            let contacts = array[2];

            contests = contests.filter( (contest) =>{
                return contest.contestEnd < new Date();
            })

            contests = contests.map( (contest) =>{
                contest.contestEnd = new Date(contest.contestEnd);
                return contest;
            });

            console.log(contests);
            res.render('admin', {
                layout: './layouts/admin-layout',
                isadmin: 'active',
                contest: contests,
                contestCount: ongoingContests.length,
                contactCount: contacts.length
            });

        });




    // models.Contest.getContests()
    // // models.Contest.getOngoingContests()
    //     .then( (contests) =>{
    //
    //         contests = contests.map( (contest) =>{
    //             contest.contestEnd = new Date(contest.contestEnd);
    //             return contest;
    //         })
    //
    //         const contestCount = contests.filter( (contest) =>{
    //             return contest.contestEnd > new Date();
    //         }).length;
    //
    //         res.render('admin',{
    //             layout: './layouts/admin-layout',
    //             isadmin: 'active',
    //             contest: contests,
    //             contestCount: contestCount
    //         });
    //     });
});





module.exports = router;
