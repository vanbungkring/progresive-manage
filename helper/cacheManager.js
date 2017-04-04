
module.exports = {
    storeCache: storeCache,
    readFromCache: readFromCache,
    deleteCache: deleteCache
};

function storeCache(key, object, options) {
    global.library.CACHE_REDIS.set(key, object, options, function(err) {
        if (err) {
            console.loge(err)
            throw err;
        }
    });
}

function readFromCache(key, callback) {
    // listen for redis connection error eventc
    console.log(key);
    global.library.CACHE_REDIS.get(key,function(err, result) {
        if (!err) {
            callback(result);
        } else {
            callback({});
        }

    });
}

function deleteCache(key) {
    require('redis-delete-wildcard')(global.library.REDIS); //pass in
    global.library.REDIS_CLIENT.delwild(key, function(error, numberDeletedKeys) {});
}
