let webpack = require('webpack');
let config = require('./config.webpack');

webpack(config, (ex) =>{
    console.log(ex);
})