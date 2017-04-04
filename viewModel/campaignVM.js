const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
const outputPagination = require(GLOBAL_PATH + '/helper/outputPagination.js');

module.exports = {
  getAllCampaign: getAllCampaign,
  findCampaign: findCampaign,
  deleteCampaign: deleteCampaign,
  createCampaign: createCampaign,
  findRelated: findRelated
};

function getAllCampaign(parameters, filter, callback) {
  if (parameters.queryParameters.campaignCategory) {
    category = parameters.queryParameters.campaignCategory;
  }
  model.campaign
    .find(parameters.queryParameters)
    .sort({
      'createdAt': -1
    })
    .populate(parameters.populate ? parameters.populate : '')
    .deepPopulate(parameters.deepPopulate)
    .skip(parameters.perPage * parameters.page)
    .limit(parameters.perPage)
    .maxTime(10000)
    .lean()
    .select(parameters.filter ? parameters.filter : '').exec(function(err, result) {
      if (err) {
        return callback(outputPagination(global.status.STATUS_FAILED, err, null));
      } else {
        model.campaign
          .count(parameters.queryParameters)
          .exec(function(err, count) {
            return callback(outputPagination(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result, result.length ? parameters.perPage : 0, result.length ? count : 0));
          })

      }
    })
}

function findCampaign(parameters, callback) {
  model.campaign
    .findOne(parameters.queryParameters)
    .populate(parameters.populate ? parameters.populate : '')
    .deepPopulate(parameters.deepPopulate ? parameters.deepPopulate : '')
    .lean()
    .select(parameters.filter ? parameters.filter : '')
    .exec(function(err, result) {
      if (err) {
        return callback(output(global.status.STATUS_FAILED, err, null));
      } else {
        return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
      }
    });
}

function deleteCampaign(parameters, callback) {
  findUser(parameters, function(result) {

  });
}

function createCampaign(parameters, callback) {
  var campaignConstruct = new model.campaign(parameters);
  campaignConstruct.save()
    .then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result)))
    .catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
}

function findRelated(parameters, callback) {
  model.campaign.findRandom({}, {}, {
    limit: 2
  }, function(err, result) {
    if (err) {
      return callback(output(global.status.STATUS_FAILED, err, null));
    } else {
      return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
    }
  });
}