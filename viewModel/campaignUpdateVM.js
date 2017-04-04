const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
const outputPagination = require(GLOBAL_PATH + '/helper/outputPagination.js');
module.exports = {
    getAllCampaignUpdate: getAllCampaignUpdate,
    findCampaignUpdate: findCampaignUpdate,
    deleteCampaignUpdate: deleteCampaignUpdate,
    createCampaignUpdate: createCampaignUpdate
};

function getAllCampaignUpdate(parameters, callback) {
    model.campaignUpdate.find(parameters.queryParameters)
    .populate(parameters.populate ? parameters.populate : '')
    .sort({'createdAt':-1})
    .skip(parameters.perPage * parameters.page)
    .limit(parameters.perPage)
    .maxTime(10000)
    .lean()
    .select(parameters.filter ? parameters.filter : '').exec(function(err, result) {
        if (err) {
            return callback(outputPagination(global.status.STATUS_FAILED, err, null));
        } else {
          model.campaignUpdate
            .count(parameters.queryParameters)
            .exec(function(err, count) {
              return callback(outputPagination(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result, result.length ? parameters.perPage : 0, result.length ? count : 0));
            })
        }
    });
}

function findCampaignUpdate(parameters, callback) {
    model.campaignUpdate.findOne(parameters).deepPopulate('merchant').select('-updatedAt -createdAt').exec(function(err, result) {
        if (err) {
            return callback(output(global.status.STATUS_FAILED, err, null));
        } else {
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
        }
    });
}

function deleteCampaignUpdate(parameters, callback) {
    findUser(parameters, function(result) {

    });
}

function createCampaignUpdate(parameters, callback) {
    var campaignUpdateConstruct = new model.campaignUpdate(parameters);
    campaignUpdateConstruct.save()
        .then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result)))
        .catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
}
