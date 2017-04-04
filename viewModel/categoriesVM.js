const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
module.exports = {
  getAllCategories: getAllCategories,
  findCategory: findCategory,
  createCategory: createCategory
};

function getAllCategories(parameters, callback) {
  model.categories
    .find(parameters)
    .sort({
      'name': 1
    })
    .deepPopulate('creator')
    .select('-creator -description -updatedAt -createdAt -__v -status')
    .exec(function(err, result) {
      if (err) {
        return callback(output(global.status.STATUS_FAILED, err, null));
      } else {
        return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
      }
    });
}

function findCategory(parameters, callback) {
  model.categories.findOne(parameters).deepPopulate('merchant').select('-updatedAt -createdAt').exec(function(err, result) {
    if (err) {
      return callback(output(global.status.STATUS_FAILED, err, null));
    } else {
      return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
    }
  });
}

function createCategory(parameters, callback) {
  var categoryConstruct = new model.categories(parameters);
  categoryConstruct.save()
    .then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result)))
    .catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
  global.library.CACHEGOOSE.clearCache(global.library.CACHE_STATUS.PREFS_CATEGORIES_CAMPAIGN_ALL);
}