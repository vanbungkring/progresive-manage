const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
module.exports = {
    getAllAuthor: getAllAuthor,
    findAuthor: findAuthor,
    createAuthor: createAuthor
};

function getAllAuthor(parameters, callback) {
    model.author.find(parameters).sort({'name': 1}).deepPopulate('creator').select('-creator -description -updatedAt -createdAt -__v -status').exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function findAuthor(parameters, callback) {
    model.author.findOne(parameters).deepPopulate('merchant').select('-updatedAt -createdAt').exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function createAuthor(parameters, callback) {
    var categoryConstruct = new model.author(parameters);
    categoryConstruct.save().then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result))).catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
}
