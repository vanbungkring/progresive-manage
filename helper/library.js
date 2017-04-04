var cloudinary = require('cloudinary');
var Random = require('random-js');
var random = new Random(Random.engines.mt19937().autoSeed());
var cacheManager = require('cache-manager');
var redisStore = require('cache-manager-redis');
var redis = require('redis');
var Agenda = require('agenda');
cloudinary.config({
    cloud_name: global.GLOBAL_CONFIG.cloudinary.name,
    api_key: global.GLOBAL_CONFIG.cloudinary.api_key,
    api_secret: global.GLOBAL_CONFIG.cloudinary.secret
});
/**
 * [exports description]
 * @type {Object}
 */
module.exports = {
    JWT: require('jsonwebtoken'),
    _: require('underscore'),
    URL: require('url'),
    FLASH: require('./flash'),
    APIMANAGER: require('./requestManager'),
    RANDOM: getRandomInt(10000, 99999),
    REDIS: require('redis'),
    AGENDA_MANAGER: new Agenda({
        db: {
            address: global.GLOBAL_CONFIG.mongodb.fullPath
        }
    }),
    REDIS_CLIENT: redis.createClient({
        host: GLOBAL_CONFIG.redis.host, // default value
        port: GLOBAL_CONFIG.redis.port, // default value
        password: GLOBAL_CONFIG.redis.pass
    }),
    CACHE_REDIS: cacheManager.caching({
        store: redisStore,
        host: GLOBAL_CONFIG.redis.host, // default value
        port: GLOBAL_CONFIG.redis.port, // default value
        auth_pass: GLOBAL_CONFIG.redis.pass,
        db: 0,
        ttl: 100000000000000000,
        compress: true
    }),
    CACHE_MANAGER: require('./cacheManager.js'),
    RANDOM_PAYMENT: getRandomPayment(100, 999),
    AGENDA: require('agenda'),
    PAGINATE: require('url-db-paging'),
    PAGINATE_COUNT: 10,
    PAGINATE_PAGE: 1,
    COUNTER: require('./incremental.js'),
    MAILGUN: require('mailgun-js')({
        apiKey: global.GLOBAL_CONFIG.mailgun.api_key,
        domain: global.GLOBAL_CONFIG.mailgun.domain
    }),
    TRUNCATE: require('truncatise'),
    SANITIZE: require('striptags'),
    CACHE_STATUS: require('./cacheStatus.js'),
    EMAIL_STATUS: require('./emailStatus.js'),
    CACHEGOOSE: require('cachegoose'),
    MONGOOOSE: require('mongoose'),
    UNIQUE_VALIDATOR: require('mongoose-unique-validator'),
    MONGOOSE_ERROR: require('./mongoose.js'),
    NUMERAL: require('numeral'),
    PASSPORT: require('passport'),
    MAILLER: require('./mailler.js'),
    CLOUDINARY: cloudinary,
    CLOUDINARY_UPLOADER: require('./cloudinaryHelper.js'),
    MOMENT: require('moment'),
    ASYNC: require('async'),
    OUTPUT: require(GLOBAL_PATH + '/helper/output.js'),
    SLUGG: require('slugg')
};
/**
 * [getRandomInt description]
 * @param  {[type]} min [description]
 * @param  {[type]} max [description]
 * @return {[type]}     [description]
 */
function getRandomInt(min, max) {
    var d = new Date();
    var n = d.getSeconds();
    var randomInt = random.integer(min, max) + n;
    return randomInt;
}

function getRandomPayment(min, max) {
    var d = new Date();
    var n = d.getSeconds();
    var randomInt = random.integer(min, max) + n;
    if (randomInt > 999) {
        return 1;
    } else {
        return randomInt;
    }
}
