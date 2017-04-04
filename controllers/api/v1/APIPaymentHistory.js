const output = require(GLOBAL_PATH + '/helper/output.js');
const paymentVM = require(GLOBAL_PATH + '/viewModel/paymentVM.js');
var paymentSubmitController = {
  detail: function(req, res) {
    if (!req.body.appToken) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_REQUIRED_MESSAGE, null));
    } else if (!req.body.transactionId) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_REQUIRED_MESSAGE, null));
    }
    var construct = {};
    var campaignSelected = '-startDate -postMeta.content -postMeta.images -campaignCategory -writer -updatedAt -createdAt -publishedStatus -postMeta.tag -featured -endDate -campaignUpdate -__v -paymentReceive';
    var populate = [{
      path: 'transactionContext.bankInfo',
      select: '-paymentCategory -__v -type -_id -merchant -description -updatedAt -createdAt -active',
    }, {
      path: 'paymentCategory',
      select: '_id name bank',
      populate: {
        path: 'bank',
        model: 'paymentAccount',
        select: 'id bank',
      }

    }];
    populate.push({
      path: 'campaign',
      model: 'campaign',
      select: campaignSelected,
      populate: {
        path: 'bank',
        model: 'paymentAccount',
        select: 'bank'
      }
    });
    construct.queryParameters = {};
    construct.populate = populate;
    construct.queryParameters._id = req.body.transactionId;
    construct.queryParameters['userContext.appToken'] = req.body.appToken;
    paymentVM.findPayment(construct, function(result) {
      if (result.data) {
        if (result.data.userContext.appToken != req.body.appToken) {
          return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TRANSACTION_ID_AND_TOKEN_NOT_MATCH, null));
        }
      }
      res.json(result);
    });
  },

  allPaymentStatus: function(req, res) {
    paymentVM.getAllPayment(req.body, {}, function(result) {
      res.json(result);
    });
  },
  history: function(req, res) {
    var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_HISTORY;
    var construct = {};
    if (req.body.appToken) {
      cacheKey += '_TOKEN_' + req.body.appToken;
    }
    var perPage = req.body.perpage ? parseInt(req.body.perpage) : 10;
    page = parseInt(req.body.page) - 1 > 0 ? parseInt(req.body.page) - 1 : 0;
    var populate = [{
      path: 'transactionContext.bankInfo',
      select: '-paymentCategory -__v -type -_id -merchant -description -updatedAt -createdAt -active',
    }, {
      path: 'paymentCategory',
      select: '_id name bank',
      populate: {
        path: 'bank',
        model: 'paymentAccount',
        select: 'id bank',
      }

    }];
    if (req.body.perpage != undefined) {
      cacheKey += 'PERPAGE_' + req.body.perpage + '_';
    }
    cacheKey += 'PAGE_' + page + '_';
    construct.queryParameters = {};
    construct.perPage = perPage;
    construct.page = page;
    construct.populate = populate;
    construct.deepPopulate = '';
    construct.filter = '-userContext -__v -paymentMethod';
    var campaignSelected = '-startDate -postMeta.content -postMeta.images -campaignCategory -writer -updatedAt -createdAt -publishedStatus -postMeta.tag -featured -endDate -campaignUpdate -__v -paymentReceive';
    if (req.params.name === 'unpaid') {
      cacheKey += 'UNPAID_';
      construct.queryParameters['status.code'] = 1;
      campaignSelected = campaignSelected + ' -bank';
    } else if (req.params.name === 'paid') {
      cacheKey += 'PAID_';
      construct.filter = construct.filter + '';
      var paidPoupulate = {
        path: 'transactionContext.paymentReceive',
        select: 'transactionContext.bankInfo transactionContext.amount transactionContext.paymentReceiveDate',
        populate: {
          path: 'transactionContext.bankInfo',
          select: 'bankInfo',
          model: 'paymentAccount',
          select: 'id bank',
        }
      };
      populate.push(paidPoupulate);
      construct.queryParameters['status.code'] = 2;
    } else if (req.params.name === 'all') {
      cacheKey += 'ALL_';
      var paidPoupulate = {
        path: 'transactionContext.paymentReceive',
        select: 'transactionContext.bankInfo transactionContext.amount transactionContext.paymentReceiveDate',
        populate: {
          path: 'transactionContext.bankInfo',
          select: 'bankInfo',
          model: 'paymentAccount',
          select: 'id bank',
        }
      };
      populate.push(paidPoupulate);
    } else {
      return next();
    }
    populate.push({
      path: 'campaign',
      model: 'campaign',
      select: campaignSelected,
      populate: {
        path: 'bank',
        model: 'paymentAccount',
        select: 'bank'
      }
    });
    if (!req.body.appToken) {
      construct.queryParameters.userContext.username = req.body.email;
      if (!req.body.email) {
        return res.json(output(global.status.STATUS_USER_EMAIL_REQUIRED, global.status.STATUS_USER_EMAIL_REQUIRED_MESSAGE, null));
      } else if (!req.body.deviceId) {
        return res.json(output(global.status.STATUS_DEVICE_ID_REQUIRED, global.status.STATUS_DEVICE_ID_REQUIRED_MESSAGE, null));
      }
    } else {
      construct.queryParameters['userContext.appToken'] = req.body.appToken;
    }
    console.log(cacheKey);
    global.library.CACHE_MANAGER.readFromCache(cacheKey, function(result) {
      if (result != null) {
        return res.json(result);
      }
      paymentVM.getAllPayment(construct, '', function(queryResult) {
        if (queryResult.data) {
          global.library.CACHE_MANAGER.storeCache(cacheKey, queryResult, {});
          return res.json(queryResult);
        }
        return res.json(queryResult);
      });
    });
  }
};
module.exports = paymentSubmitController;
