//server.js

// set up ==============================================================================================================
var express = require('express');
const http = require('http');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const moment = require('moment');
const passport = require('passport');
const session = require('express-session');
const hbs = require('hbs');
const helpers = require('handlebars-helpers')({
  handlebars: hbs
})
require('./auth');
global.jQuery = require('jquery');
var $ = global.jQuery;
// window.$ = $;

let Vue = require('vue');
// var validator = require('vue-validator');
// var resource = require('vue-resource');
// window.Vue = Vue;

// Vue.use(validator);
// Vue.use(resource);


// routes ==============================================================================================================

var index = require('./routes/index');
const socialMedia = require('./routes/social-media');
const contactUs = require('./routes/contact-us');
const login = require('./routes/login');
const admin = require('./routes/admin');


const models = require('./models');
var app = express();

//config ===============================================================================================================
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
  secret: 'dslkfjqjfwerwer',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// use routes ==========================================================================================================

app.use('/', index);
app.use('/social-media', socialMedia);
app.use('/contact-us', contactUs);
app.use('/login', login);
app.use('/admin', admin);



// error handling ======================================================================================================

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
    console.log(err);

    res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');

});

module.exports = app;

// launch ==============================================================================================================

http.createServer(app).listen(8080, () => {
    console.log('Express server listening on port 8080');
});
