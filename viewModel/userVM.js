const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
module.exports = {
    getAllUser: getAllUser,
    findUser: findUser,
    createUser: createUser
};

function getAllUser(parameters, callback) {
    model.user.find(parameters).sort([
        ['date', -1]
    ]).deepPopulate('merchant').select().exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function findUser(parameters, callback) {
    model.user.findOne(parameters).deepPopulate('merchant').select('-updatedAt -createdAt').exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function createUser(parameters, callback) {
    var userConstruct = new model.user(parameters);
    userConstruct.save().then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result))).catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)));
}
