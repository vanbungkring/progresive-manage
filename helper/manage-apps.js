var expressLayouts = require('express-ejs-layouts');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var redisStore = require('connect-redis')(session);
var logger = require('./logger');
var numeral = require('numeral');
var moment = require('moment');
var flash = require('connect-flash');

module.exports = function(app, express, passport, path) {
    require(GLOBAL_PATH + '/helper/passport')(passport); // pass passport for configuration
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'ejs');
    app.use(express.static(path.join(__dirname, '../public')));
    app.use(express.static(path.join(__dirname, '../public/front')));
    app.use(require('connect-assets')());
    app.use(expressLayouts);
    require('./agenda-job/');
    app.use(flash());
    app.locals._ = global.library._;
    app.locals.sanitizeSpace = function(parameters) {
        return parameters.split(' ').join('_').toLowerCase();
    };
    app.locals.excerpt = function(string,limit){
      return string.substring(0,parseInt(limit))
    }
    app.locals.numeral = global.library.NUMERAL;
    app.locals.PREFIX_ROUTE_BACK_OFFICE = global.PREFIX_ROUTE_BACK_OFFICE;
    var sessionOpts = {
        saveUninitialized: false,
        resave: false,
        store: new redisStore({
            host: GLOBAL_CONFIG.redis.host,
            port: GLOBAL_CONFIG.redis.port,
            client: global.library.REDIS_CLIENT,
            pass: GLOBAL_CONFIG.redis.pass,
            prefix: GLOBAL_CONFIG.redis.prefixweb,
            ttl: GLOBAL_CONFIG.redis.ttl
        }), // connect-mongo session store
        secret: GLOBAL_CONFIG.app.secret
    };
    app.use(session(sessionOpts));
    app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
    app.use(passport.initialize());
    app.use(passport.session({
        maxAge: new Date(Date.now() + 3600000)
    }));
    app.use(cookieParser(GLOBAL_CONFIG.app.secret));
    app.use(require('morgan')({'stream': logger.stream}));
    logger.transports.file.level = 'verbose';
    app.locals.menu_aceess = function() {
        global.library.ASYNC.parallel({})
    }
    app.locals.public_access = GLOBAL_CONFIG.public;
    app.use(function(req, res, next) {
        if (req.user) {
            var data = req.user.toObject();
            delete data['password'];
            app.locals.user_active = data;
        }
        next();
    });
    require(GLOBAL_PATH + '/routes/backend/index.js')(app, passport); // load our routes and pass in our app
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('backend/error/index', {
                layout: 'backend/layout/base',
                title: err.status,
                message: err.message,
                error: err,
                state: 'err'
            });
        });
    }
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('backend/error/index', {
            layout: 'backend/layout/base',
            title: err.status,
            message: err.message,
            error: err,
            state: 'err'
        });
    });
    app.locals.youtubeThumbnail = function(string) {
        var youtubeId = string.split('v=')[1]
        return "https://img.youtube.com/vi/" + youtubeId + "/0.jpg"
    }
    app.locals.youtubeId = function(string){
        var youtubeId = string.split('v=')[1];
        return youtubeId;
    }
    app.locals.thousandSeparatorOnly = function(nStr) {
        return number_format(nStr, 0, '', '.');
    };
    app.locals.formatCurrencyShort = function(nStr) {
        return numeral(nStr).format('0.0a');
    };
    app.locals.isActive = function(strMenu, strState, strReturn) {
        //console.log('strState');
        if (typeof strReturn === 'undefined')
            strReturn = 'active';
        return (strMenu.indexOf(strState) >= 0)
            ? strReturn
            : '';
        // return (strMenu.indexOf(strState));
    };
    app.locals.imgTransform = function(url, transform) {
        transform = transform == null
            ? 'h_100,q_60,c_fit'
            : transform;
        var pattern = /upload/i;
        var newPattern = 'upload/' + transform;
        if (url !== '')
            url = url.replace(pattern, newPattern);
        return url.replace('http', 'https');
    };
    app.locals.formatDate = function(date) {
        return moment(date).format('YYYY-MM-DD HH:mm:ss');
    };

    app.locals.fromNowWithLimit = function(date) {
        var end = moment(date);
        var now = moment();
        var endYr = moment(date).format('YYYY');
        var nowYr = moment().format('YYYY');
        var d = end.diff(now, 'd');

        // console.log(d);
        if (d > -8) {
            return moment(date).fromNow();
        } else if (endYr == nowYr) {
            return moment(date).format('D MMM');
        } else {
            return moment(date).format('D MMM YYYY');
        }
    };
};

function number_format(number, decimals, dec_point, thousands_sep) {
    // http://kevin.vanzonneveld.net
    var n = !isFinite(+ number)
            ? 0
            : + number,
        prec = !isFinite(+ decimals)
            ? 0
            : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined')
            ? ','
            : thousands_sep,
        dec = (typeof dec_point === 'undefined')
            ? '.'
            : dec_point,
        toFixedFix = function(n, prec) {
            // Fix for IE parseFloat(0.55).toFixed(0) = 0;
            var k = Math.pow(10, prec);
            return Math.round(n * k) / k;
        },
        s = (prec
            ? toFixedFix(n, prec)
            : Math.round(n)).toString().split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}
