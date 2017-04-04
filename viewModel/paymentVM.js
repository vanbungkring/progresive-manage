const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
const outputPagination = require(GLOBAL_PATH + '/helper/outputPagination.js');
module.exports = {
    createPayment: createPayment,
    getAllPayment: getAllPayment,
    findPayment: findPayment
};
function getAllPayment(parameters, filter, callback) {
    if (parameters.status == 2) {
        key = global.library.CACHE_STATUS.PREF_CACHE_USER_HISTORY_PAID + '' + parameters.userContext.appToken;
    }
    model.payment.find(parameters.queryParameters).sort({
            'updatedAt': -1
        })
        .populate(parameters.populate?parameters.populate:'')
        .deepPopulate(parameters.deepPopulate?parameters.deepPopulate:'')
        .skip(parameters.perPage * parameters.page)
        .limit(parameters.perPage)
        .maxTime(10000)
        .lean()
        .select(parameters.filter)
        .exec(function(err, result) {
            if (err) {
                return callback(output(global.status.STATUS_FAILED, err, null));
            } else {
                model.payment
                    .count(parameters.queryParameters)
                    .exec(function(err, count) {
                        return callback(outputPagination(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result, result.length ? parameters.perPage : 0, result.length ? count : 0));
                    });
                    //  return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
            }
        });
}

function findPayment(parameters, callback) {
    model.payment.findOne(parameters.queryParameters)
    .populate(parameters.populate?parameters.populate:'')
    .deepPopulate(parameters.deepPopulate?parameters.deepPopulate:'')
    .select(parameters.filter?parameters.filter:'')
    .exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}


function createPayment(parameters, callback) {
    var paymentConstruct = new model.payment(parameters);
    paymentConstruct.save()
        .then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result)))
        .catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
}
