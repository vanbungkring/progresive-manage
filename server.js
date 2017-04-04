var express = require('express');
var path = require('path');
var cors = require('cors')
var loggers = require('morgan');
var passport = require('passport');
var config = require('config');
var basicAuth = require('basic-auth');
var helmet = require('helmet');
var bodyParser = require('body-parser');
var app = new express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

var api = new express();
api.use(helmet());
var back = new express();
app.use('/api/', api); /// init mounting
global.GLOBAL_PATH = path.resolve(__dirname);
const output = require(GLOBAL_PATH + '/helper/output.js');
global.GLOBAL_CONFIG = config;
global.PREFIX_ROUTE_BACK_OFFICE = '';
global._ = require('underscore');
app.use(back);
global.status = require('./helper/status.js');
global.library = require('./helper/library.js');

//require('./helper/front-apps')(app, express, passport, path);
require('./helper/manage-apps')(back, express, passport, path);
api.use(loggers('dev'));

var auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_AUTH_NOT_AUTHORIZED, null));
    }
    var user = basicAuth(req);
    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    }
    if (user.name === 'zispro' && user.pass === 'zispro123') {
        return next();
    } else {
        return unauthorized(res);
    }
};

var corsOptions = {
  origin: global.GLOBAL_CONFIG.cors.allow,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
api.use(cors(corsOptions))
require('./routes/api/v1/index.js')(api, auth); // load our routes and pass in our app

module.exports = app;
