var express = require('express');
var router = express.Router();
const models = require('../models');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('contact-us', { title: 'Express' });
});

router.post('/', (req,res) =>{

    const subject = req.body.subject;
    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;


    const newContact = new models.Contact({

        subject: subject,
        name: name,
        email: email,
        message: message
    });
    console.log(newContact);

    newContact.saveToDB();

    res.send('hello from post new-contact');
})

module.exports = router;
