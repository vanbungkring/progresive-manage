const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
module.exports = {
    getAllPaymentAccount: getAllPaymentAccount,
    createPaymentAccount: createPaymentAccount,
    findPaymentAccount: findPaymentAccount
}

function getAllPaymentAccount(parameters, selection, callback) {
    model.paymentAccount.find(parameters).deepPopulate('merchant paymentCategory bank').select(selection).exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function findPaymentAccount(parameters, filter, callback) {
    console.log('parameters', parameters);
    model.paymentAccount.findOne(parameters).exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function createPaymentAccount(parameters, callback) {
    var paymentAccount = new model.paymentAccount(parameters);
    paymentAccount.save(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED_MESSAGE, err, null));
        } else {
            console.log(result);
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}
