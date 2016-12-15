var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('social-media', { title: 'Social Media' });
});

module.exports = router;
