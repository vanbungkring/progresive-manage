const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');

module.exports = {
    createPaymentConfirmation: createPaymentConfirmation,
    findPaymentConfirmation: findPaymentConfirmation,
    getAllPaymentConfirmation: getAllPaymentConfirmation
};

function findPaymentConfirmation(parameters, callback) {
    model.paymentConfirmation.find(parameters).deepPopulate('transactionContext.payment').exec(function(err, result) {
        if (err) {
            callback([]);
        } else {
            callback(result);
        }
    });
}

function getAllPaymentConfirmation(parameters, filter, callback) {
    model.paymentConfirmation.find(parameters).sort([
        ['date', 1]
    ]).select(filter).exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED_MESSAGE, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function createPaymentConfirmation(parameters, callback) {
    var paymentConfirmationConstruct = new model.paymentConfirmation(parameters);
    paymentConfirmationConstruct.save()
        .then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result)))
        .catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
}
