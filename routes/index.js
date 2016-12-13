var express = require('express');
var router = express.Router();
const models = require('../models');
const moment = require('moment');
let endingSoon = 'COUNTDOWN NYE';

/* GET home page. */
router.get('/', (req,res) => {

    models.Counter.addToDB(1);
    models.Contest.getOngoingContests()
        .then( (ongoingContests) => {
            // console.log(ongoingContests)
          res.render('index', {
              title: 'EDM SWEEP',
              endingSoon: endingSoon,
              contest: ongoingContests
          });
        });

});


module.exports = router;
