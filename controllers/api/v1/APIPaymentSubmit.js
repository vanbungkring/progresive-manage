const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const paymentCategoryVM = require(GLOBAL_PATH + '/viewModel/paymentCategoryVM.js');
const donorVM = require(GLOBAL_PATH + '/viewModel/donorVM.js');
const output = require(GLOBAL_PATH + '/helper/output.js');
const model = require(GLOBAL_PATH + '/models/index');
const paymentVM = require(GLOBAL_PATH + '/viewModel/paymentVM.js');

var paymentCategoryName = '';
var paymentSubmitController = {
  zis: function(req, res) {
    var currentDate = new Date();
    var contextUser = {};
    var transactionContext = {};
    var construct = {};
    if (!req.body.paymentCategoryId) {
      return res.json(output(global.status.STATUS_PARAMETERS_PAYMENT_CATEGORY_ID_REQUIRED, global.status.STATUS_PARAMETERS_PAYMENT_CATEGORY_ID_REQUIRED_MESSAGE, null));
    } else if (!req.body.bankId) {
      return res.json(output(global.status.STATUS_BANK_ID_REQUIRED, global.status.STATUS_BANK_ID_REQUIRED_MESSAGE, null));
    } else if (!req.body.amount) {
      return res.json(output(global.status.STATUS_PARAMETERS_AMOUNT_REQUIRED, global.status.STATUS_PARAMETERS_AMOUNT_REQUIRED_MESSAGE, null));
    }
    if (!req.body.appToken) {
      if (!req.body.email) {
        return res.json(output(global.status.STATUS_USER_EMAIL_REQUIRED, global.status.STATUS_USER_EMAIL_REQUIRED_MESSAGE, null));
      } else if (!req.body.name) {
        return res.json(output(global.status.STATUS_USER_FULL_NAME_REQUIRED, global.status.STATUS_USER_FULL_NAME_REQUIRED_MESSAGE, null));
      } else if (!req.body.deviceId) {
        return res.json(output(global.status.STATUS_DEVICE_ID_REQUIRED, global.status.STATUS_DEVICE_ID_REQUIRED_MESSAGE, null));
      }

      var parameters = {};
      parameters.username = req.body.email;
      donorVM.findByusername(parameters, function(result) {
        if (result.status === global.status.STATUS_FAILED) {
          return res.json(result);
        } else if (result.data != undefined) {
          contextUser.appToken = result.data.appToken;
          contextUser.donor = result.data._id;
          contextUser.deviceId = req.body.deviceId;
          contextUser.username = req.body.email;
          transactionContext.amount = req.body.amount;
          transactionContext.uniqueCode = global.library.RANDOM_PAYMENT;
          transactionContext.expireDate = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.expire)).unix();
          transactionContext.reminder = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.reminder)).unix();
          transactionContext.totalAmount = parseInt(req.body.amount) + parseInt(transactionContext.uniqueCode);
          transactionContext.formattedAmountIDR = global.library.NUMERAL(transactionContext.totalAmount).format('0,0').toString();
          transactionContext.bankInfo = req.body.bankId;
          submitPaymentZIS(req.body.paymentCategoryId, transactionContext, contextUser, function(result) {
            res.json(result);
          });
        } else {

          var donorConstructor = {};
          donorConstructor.username = req.body.email;
          donorConstructor.name = req.body.name;
          donorConstructor.activationToken = global.library.RANDOM;
          donorConstructor.status = 1;
          donorConstructor.registerStatus = 1;
          donorConstructor.provider = 'LOCAL';
          var token = global.library.JWT.sign({
            username: req.body.email,
            created: new Date()
          }, global.GLOBAL_CONFIG.app.sign_secret);
          donorConstructor.appToken = token;
          var models = new model.donor(donorConstructor);
          models.save(function(err, result) {
            if (err) {
              return res.json(err);
            }
            contextUser.appToken = result.appToken;
            contextUser.donor = result._id;
            contextUser.deviceId = req.body.deviceId;
            contextUser.username = req.body.email;
            transactionContext.amount = req.body.amount;
            transactionContext.expireDate = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.expire)).unix();
            transactionContext.reminder = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.reminder)).unix();

            transactionContext.uniqueCode = global.library.RANDOM_PAYMENT;
            transactionContext.totalAmount = parseInt(req.body.amount) + parseInt(transactionContext.uniqueCode);
            transactionContext.formattedAmountIDR = global.library.NUMERAL(transactionContext.totalAmount).format('0,0').toString();
            transactionContext.bankInfo = req.body.bankId;
            submitPaymentZIS(req.body.paymentCategoryId, transactionContext, contextUser, function(result) {
              res.json(result);
            });
          });
        }
      });
    } else {
      global.library.ASYNC.waterfall([
        function(callback) {
          var construct = {};
          construct.queryParameters = {};
          construct.queryParameters._id = req.body.paymentCategoryId;
          paymentCategoryVM.getSinglePaymentCategory(construct, function(result) {
            if (result.data) {
              paymentCategoryName = result.data.name;
              callback(req.body.paymentCategoryId);
            } else {
              return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_CAMPAIGN_NOT_FOUND_MESSAGE, null));
            }
          });
        }
      ], function(done) {
        donorVM.findByAppToken({
          'appToken': req.body.appToken
        }, {}, function(result) {
          if (result.data != undefined) {
            contextUser.appToken = req.body.appToken;
            contextUser.donor = result.data._id;
            contextUser.deviceId = req.body.deviceId;
            contextUser.remarks = req.body.remarks ? req.body.remarks : '';
            contextUser.email = result.data.username;
            transactionContext.amount = req.body.amount;
            transactionContext.expireDate = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.expire)).unix();
            transactionContext.reminder = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.reminder)).unix();
            transactionContext.uniqueCode = global.library.RANDOM_PAYMENT;
            transactionContext.totalAmount = parseInt(req.body.amount) + parseInt(transactionContext.uniqueCode);
            transactionContext.formattedAmountIDR = global.library.NUMERAL(transactionContext.totalAmount).format('0,0').toString();
            transactionContext.bankInfo = req.body.bankId;
            submitPaymentZIS(req.body.paymentCategoryId, transactionContext, contextUser, function(submitPaymentResult) {
              res.json(submitPaymentResult);
            });
          } else {
            res.json(result);
          }
        });
      });
    }
  },
  campaign: function(req, res) {
    var currentDate = new Date();
    var contextUser = {};
    var transactionContext = {};
    var construct = {};
    var filter = 'bank _id';
    if (!req.body.campaignId) {
      return res.json(output(global.status.STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED, global.status.STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED_MESSAGE, null));
    } else if (!req.body.bankId) {
      return res.json(output(global.status.STATUS_BANK_ID_REQUIRED, global.status.STATUS_BANK_ID_REQUIRED_MESSAGE, null));
    } else if (!req.body.amount) {
      return res.json(output(global.status.STATUS_PARAMETERS_AMOUNT_REQUIRED, global.status.STATUS_PARAMETERS_AMOUNT_REQUIRED_MESSAGE, null));
    }
    if (!req.body.appToken) {
      if (!req.body.email) {
        return res.json(output(global.status.STATUS_USER_EMAIL_REQUIRED, global.status.STATUS_USER_EMAIL_REQUIRED_MESSAGE, null));
      } else if (!req.body.name) {
        return res.json(output(global.status.STATUS_USER_FULL_NAME_REQUIRED, global.status.STATUS_USER_FULL_NAME_REQUIRED_MESSAGE, null));
      } else if (!req.body.deviceId) {
        return res.json(output(global.status.STATUS_DEVICE_ID_REQUIRED, global.status.STATUS_DEVICE_ID_REQUIRED_MESSAGE, null));
      }

      var parameters = {};
      parameters.username = req.body.email;
      donorVM.findByusername(parameters, function(result) {
        if (result.status === global.status.STATUS_FAILED) {
          return res.json(result);
        } else if (result.data != undefined) {
          contextUser.appToken = result.data.appToken;
          contextUser.donor = result.data._id;
          contextUser.deviceId = req.body.deviceId;
          contextUser.username = req.body.email;
          transactionContext.amount = req.body.amount;
          transactionContext.expireDate = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.expire)).unix();
          transactionContext.reminder = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.reminder)).unix();
          transactionContext.uniqueCode = global.library.RANDOM_PAYMENT;
          transactionContext.totalAmount = parseInt(req.body.amount) + parseInt(transactionContext.uniqueCode);
          transactionContext.formattedAmountIDR = global.library.NUMERAL(transactionContext.totalAmount).format('0,0').toString();
          transactionContext.bankInfo = req.body.bankId;
          submitPayment(req.body.campaignId, transactionContext, contextUser, function(result) {
            res.json(result);
          });
        } else {
          var donorConstructor = {};
          donorConstructor.username = req.body.email;
          donorConstructor.name = req.body.name;
          donorConstructor.activationToken = global.library.RANDOM;
          donorConstructor.status = 1;
          donorConstructor.registerStatus = 1;
          donorConstructor.provider = 'LOCAL';
          var token = global.library.JWT.sign({
            username: req.body.email,
            created: new Date()
          }, global.GLOBAL_CONFIG.app.sign_secret);
          donorConstructor.appToken = token;
          var models = new model.donor(donorConstructor);
          models.save(function(err, result) {
            if (err) {
              return res.json(err);
            }
            contextUser.appToken = result.appToken;
            contextUser.donor = result._id;
            contextUser.deviceId = req.body.deviceId;
            contextUser.username = req.body.email;
            transactionContext.expireDate = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.expire)).unix();
            transactionContext.reminder = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.reminder)).unix();
            transactionContext.amount = req.body.amount;
            transactionContext.uniqueCode = global.library.RANDOM_PAYMENT;
            transactionContext.totalAmount = parseInt(req.body.amount) + parseInt(transactionContext.uniqueCode);
            transactionContext.formattedAmountIDR = global.library.NUMERAL(transactionContext.totalAmount).format('0,0').toString();
            transactionContext.bankInfo = req.body.bankId;
            submitPayment(req.body.campaignId, transactionContext, contextUser, function(result) {
              res.json(result);
            });
          });
        }
      });
    } else {
      global.library.ASYNC.waterfall([
        function(callback) {
          var construct = {};
          construct.queryParameters = {};
          construct.queryParameters._id = req.body.campaignId;
          construct.deepPopulate = 'merchant';
          construct.filter = '-updatedAt -campaignCategory -writer -bank -publishedStatus -featured -postMeta.tag -__v';
          campaignVM.findCampaign(construct, function(result) {
            if (result.data) {
              callback(req.body.campaignId);
            } else {
              return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_CAMPAIGN_NOT_FOUND_MESSAGE, null));
            }
          });
        }
      ], function(done) {
        donorVM.findByAppToken({
          'appToken': req.body.appToken
        }, {}, function(result) {
          if (result.data != undefined) {
            contextUser.appToken = req.body.appToken;
            contextUser.donor = result.data._id;
            contextUser.anonymous = req.body.anonymous ? req.body.anonymous : '';
            contextUser.remarks = req.body.remarks ? req.body.remarks : '';
            contextUser.deviceId = req.body.deviceId;
            contextUser.email = result.data.username;
            transactionContext.amount = req.body.amount;
            transactionContext.expireDate = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.expire)).unix();
            transactionContext.reminder = global.library.MOMENT(new Date(currentDate.getTime() + global.GLOBAL_CONFIG.payment.rule.reminder)).unix();
            transactionContext.uniqueCode = global.library.RANDOM_PAYMENT;
            transactionContext.totalAmount = parseInt(req.body.amount) + parseInt(transactionContext.uniqueCode);
            transactionContext.formattedAmountIDR = global.library.NUMERAL(transactionContext.totalAmount).format('0,0').toString();
            transactionContext.bankInfo = req.body.bankId;
            submitPayment(req.body.campaignId, transactionContext, contextUser, function(submitPaymentResult) {
              res.json(submitPaymentResult);
            });
          } else {
            res.json(result);
          }
        });
      });
    }
  }
};

function submitPaymentZIS(paymentCategory, transactionContext, userContext, callback) {
  var constructors = {};
  constructors.paymentCategory = paymentCategory;
  constructors.paymentType = paymentCategoryName ? paymentCategoryName.toLowerCase() : '';
  constructors.paymentCategory = paymentCategory;
  constructors.transactionContext = transactionContext;
  constructors.userContext = userContext;
  paymentVM.createPayment(constructors, function(result) {
    if (result.status === global.status.STATUS_SUCCESS) {
      var populate = [{
        path: 'transactionContext.bankInfo',
        select: 'bank',
        select: '-updatedAt -createdAt -active -_id -paymentCategory -description -type -__v -merchant'
      }, {
        path: 'campaign',
        model: 'campaign',
        select: '-_id -startDate -fundRaisingTarget -fundRaisingProgress -bank -postMeta.content -postMeta.images -postMeta.image -campaignCategory -writer -updatedAt -createdAt -publishedStatus -postMeta.tag -featured -endDate -campaignUpdate -__v -paymentReceive',
        populate: {
          path: 'bank',
          model: 'paymentAccount',
          select: 'bank'
        }
      }];
      var construct = {};
      //'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo'
      construct.queryParameters = {};
      construct.queryParameters._id = result.data._id;
      construct.populate = populate;
      construct.filter = '-status -updatedAt -__v -paymentMethod';
      construct.deepPopulate = '';
      paymentVM.findPayment(construct, function(result) {
        callback(result);
        if (result.status === global.status.STATUS_SUCCESS) {
          constructMailForDonationCreated(result.data);
        }
      });
    }
  });
}

function submitPayment(campaignId, transactionContext, userContext, callback) {
  var constructors = {};
  var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_HISTORY;
  cacheKey += '_TOKEN_' + userContext.appToken + '*';
  constructors.campaign = campaignId;
  constructors.transactionContext = transactionContext;
  constructors.userContext = userContext;
  paymentVM.createPayment(constructors, function(result) {
    if (result.status === global.status.STATUS_SUCCESS) {
      var populate = [{
        path: 'transactionContext.bankInfo',
        select: 'bank',
        select: '-updatedAt -createdAt -active -_id -paymentCategory -description -type -__v -merchant'
      }, {
        path: 'campaign',
        model: 'campaign',
        select: '-_id -startDate -fundRaisingTarget -fundRaisingProgress -bank -postMeta.content -postMeta.images -postMeta.image -campaignCategory -writer -updatedAt -createdAt -publishedStatus -postMeta.tag -featured -endDate -campaignUpdate -__v -paymentReceive',
        populate: {
          path: 'bank',
          model: 'paymentAccount',
          select: 'bank'
        }
      }];
      var construct = {};
      //'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo'
      construct.queryParameters = {}
      construct.queryParameters._id = result.data._id;
      construct.populate = populate;
      construct.filter = '-status -updatedAt -__v -paymentMethod'
      construct.deepPopulate = '';
      paymentVM.findPayment(construct, function(result) {
        callback(result);
        if (result.status === global.status.STATUS_SUCCESS) {
          global.library.CACHE_MANAGER.deleteCache(cacheKey);
          constructMailForDonationCreated(result.data);
        }
      });
    }
  });
}
/**
 * create constructor for email notification donors
 * @param  {[type]} context [description]
 * @return {[type]}         [description]
 */
function constructMailForDonationCreated(context) {
  var receiver = context.userContext.email;
  var title = 'Transfer Rp' + context.transactionContext.formattedAmountIDR + ' ke rekening berikut:';
  global.library.MAILLER.sendDonorDonationCreated(receiver, title, context);
}
module.exports = paymentSubmitController;
