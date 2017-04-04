const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
module.exports = {
    getAllPaymentCategory: getAllPaymentCategory,
    getAllPaymentCategoryBySlug: getAllPaymentCategoryBySlug,
    getSinglePaymentCategory: getSinglePaymentCategory,
    createPaymentcategory: createPaymentcategory,
};

function createPaymentcategory(parameters, callback) {
    var paymentCategory = new model.paymentCategory(parameters);

    paymentCategory.save(function(err, result) {
      paymentCategory.save()
          .then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result)))
          .catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
    });
}

function getAllPaymentCategory(parameters, callback) {
    model.paymentCategory.find(parameters.queryParameters?parameters.queryParameters:{})
    .populate(parameters.populate?parameters.populate:'')
    .deepPopulate(parameters.deepPopulate?parameters.deepPopulate:'')
    .lean()
    .select(parameters.filter?parameters.filter:'')
    .sort()
    .exec(function(err, result) {
      if (err) {
          return callback(output(global.status.STATUS_FAILED, err, null));
      } else {
          return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
      }
    });
}

function getAllPaymentCategoryBySlug() {

}

function getSinglePaymentCategory(parameters, callback) {
    model.paymentCategory.findOne(parameters.queryParameters)
    .populate(parameters.populate?parameters.populate:'')
    .deepPopulate(parameters.deepPopulate?parameters.deepPopulate:'')
    .lean()
    .select(parameters.filter?parameters.filter:'')
    .sort()
    .exec(function(err, result) {
      if (err) {
          return callback(output(global.status.STATUS_FAILED, err, null));
      } else {
          return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
      }
    });
}
