const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
module.exports = {
    createPaymentReceive: createPaymentReceive,
    getAllPaymentReceive: getAllPaymentReceive
};

function getAllPaymentReceive(parameters, callback) {
    model.paymentReceive.find(parameters).select().exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function createPaymentReceive(parameters, callback) {
    var paymentReceiveConstruct = new model.paymentReceive(parameters);
    paymentReceiveConstruct.save(function(err, result) {
        if (!err) {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
        return callback(output(global.status.STATUS_FAILED, err, null));
    });
}
