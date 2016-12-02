var express = require('express');
var router = express.Router();
const models = require('../models');
const moment = require('moment');
const lwip = require('lwip');
let endingSoon = 'COUNTDOWN NYE';

/* GET home page. */
router.get('/', (req,res) => {
    lwip.open('./public/images/face1.jpg', function(err, image) {
        if (err) throw err;
        var _cropOpt = {
            left: 400,
            top: 200,
            right: 699,
            bottom: 499
        }; // extract the face from the pic

        image.crop(_cropOpt.left, _cropOpt.top, _cropOpt.right, _cropOpt.bottom, function(err, crpdImg) {
            if (err) throw err;
            crpdImg.writeFile('./public/images/face2.jpg', function(err) {
                if (err) throw err;
            });
        });

    });


    models.Contest.getOngoingContests()
        .then( (ongoingContests) => {
          res.render('index', {
              title: 'EDM SWEEP',
              endingSoon: endingSoon,
              contest: ongoingContests
          });
        });

});;


module.exports = router;
