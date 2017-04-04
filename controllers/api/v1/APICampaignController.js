const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const campaignUpdateVM = require(GLOBAL_PATH + '/viewModel/campaignUpdateVM.js');
const paymentVM = require(GLOBAL_PATH + '/viewModel/paymentVM.js');
const output = require(GLOBAL_PATH + '/helper/output.js');
var APIcampaignController = {
  index: function(req, res) {
    var populate = [{
      path: 'campaignCategory',
      select: 'name _id'
    }, {
      path: 'writer',
      select: '_id firstName lastName'
    }, {
      path: 'paymentReceive',
      select: 'transactionContext.payment createdAt',
      options: {
        sort: {
          'createdAt': -1
        }
      },
      populate: {
        path: 'transactionContext.payment',
        model: 'payment',
        select: 'transactionContext.totalAmount userContext.anonymous userContext.donor userContext.remarks',
        populate: {
          path: 'userContext.donor',
          model: 'donor',
          select: 'name avatar'
        }
      }
    }, {
      path: 'bank',
      select: 'bank'
    }];
    var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN;
    var construct = {};
    var perPage = req.body.perpage ? parseInt(req.body.perpage) : 10;

    page = parseInt(req.body.page) - 1 > 0 ? parseInt(req.body.page) - 1 : 0;
    construct.queryParameters = {};
    if (req.body.perpage != undefined) {
      cacheKey += 'PERPAGE_' + req.body.perpage + '_';
    }
    cacheKey += 'PAGE_' + page + '_';
    construct.queryParameters.publishedStatus = 1;
    // console.log(req.body);
    if (req.body.featured) {
      construct.queryParameters.featured = req.body.featured;
      cacheKey += 'FEATURED_';
    }
    if (req.body.category) {
      construct.queryParameters.campaignCategory = global.library.MONGOOOSE.Types.ObjectId(req.body.category);
      cacheKey += 'CATEGORY_' + req.body.category + '_';
    }

    construct.perPage = perPage;
    construct.populate = populate;
    construct.page = page;
    construct.deepPopulate = 'merchant';
    construct.filter = '-postMeta.content -postMeta.tag  -__v -publishedStatus -updatedAt';
    if (req.body.appToken) {
      delete req.body.appToken;
    }
    global.library.CACHE_MANAGER.readFromCache(cacheKey, function(result) {
      if (result != null) {
        return res.json(result);
      }
      campaignVM.getAllCampaign(construct, '-password', function(queryResult) {
        if (queryResult.data) {
          global.library.CACHE_MANAGER.storeCache(cacheKey, queryResult, {});
          return res.json(queryResult);
        }
        return res.json(queryResult);
      });
    });
  },
  findBySlugg: function(req, res) {
    var populate = [{
      path: 'campaignCategory',
      select: 'name _id'
    }, {
      path: 'writer',
      select: '_id firstName lastName'
    }, {
      path: 'bank',
      select: 'bank'
    }];
    if (req.body.appToken) {
      delete req.body.appToken;
    }
    if (!req.body.slug) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED_MESSAGE, null));
    }
    // console.log(req.body);
    var construct = {};
    construct.queryParameters = {};
    construct.populate = populate;
    construct.queryParameters['postMeta.slug'] = req.body.slug;
    campaignVM.findCampaign(construct, function(result) {
      return res.json(result);
    });
  },
  findById: function(req, res) {
    if (req.body.appToken) {
      delete req.body.appToken;
    }
    if (!req.body.campaignId) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED_MESSAGE, null));
    }
    var construct = {};
    construct.queryParameters = {};
    construct.queryParameters._id = req.body.campaignId;
    construct.deepPopulate = 'merchant';
    construct.filter = '-updatedAt -campaignCategory -writer -bank -publishedStatus -featured -postMeta.tag -__v';
    campaignVM.findCampaign(construct, function(result) {
      return res.json(result);
    });
  },
  campaignUpdate: function(req, res) {
    var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_UPDATE;
    if (req.body.appToken) {
      delete req.body.appToken;
    }
    if (!req.body.campaignId) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED_MESSAGE, null));
    }
    var construct = {};
    var perPage = parseInt(req.body.perpage) ? parseInt(req.body.perpage) : 10,
      page = parseInt(req.body.page) - 1 > 0 ? parseInt(req.body.page) - 1 : 0;
    if (req.body.perpage != undefined) {
      cacheKey += 'PERPAGE_' + req.body.perpage + '_';
    }
    cacheKey += 'PAGE_' + page + '_';
    cacheKey += 'CAMPAIGN_ID_' + req.body.campaignId + '_'
    construct.queryParameters = {};
    construct.queryParameters.campaign = req.body.campaignId;
    construct.perPage = perPage;
    construct.page = page;
    construct.filter = '-updatedAt -campaignCategory -writer -bank -publishedStatus -featured -postMeta.tag -__v -campaign -_id';
    global.library.CACHE_MANAGER.readFromCache(cacheKey, function(result) {
      if (result != null) {
        return res.json(result);
      }
      campaignUpdateVM.getAllCampaignUpdate(construct, function(result) {
        if (queryResult.data) {
          global.library.CACHE_MANAGER.storeCache(cacheKey, result, {});
          return res.json(result);
        }
        return res.json(result);
      });
    });
    campaignUpdateVM.getAllCampaignUpdate(construct, function(result) {
      return res.json(result);
    });
  },
  campaignDonor: function(req, res) {
    var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_DONOR;
    if (req.body.appToken) {
      delete req.body.appToken;
    }
    if (!req.body.campaignId) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED_MESSAGE, null));
    }

    var construct = {};
    var perPage = parseInt(req.body.perpage) ? parseInt(req.body.perpage) : 10,
      page = parseInt(req.body.page) - 1 > 0 ? parseInt(req.body.page) - 1 : 0;
    var populate = [{
      path: 'userContext.donor',
      select: 'name avatar',
    }];
    cacheKey += 'PAGE_' + page + '_';
    cacheKey += 'CAMPAIGN_ID_' + req.body.campaignId + '_'
    construct.queryParameters = {};
    construct.populate = populate;
    construct.perPage = perPage;
    construct.page = page;
    construct.filter = '-updatedAt -campaignCategory -writer -bank -publishedStatus -featured -postMeta.tag -__v -campaign -_id -paymentType -paymentMethod -paymentSource -transactionId -status -transactionContext.uniqueCode -transactionContext.paymentReceive -transactionContext.bankInfo -transactionContext.formattedAmountIDR -transactionContext.reminder -transactionContext.expireDate -transactionContext.amount -userContext.email -userContext.appToken';
    construct.queryParameters.campaign = req.body.campaignId;
    construct.queryParameters['status.code'] = 2;

    global.library.CACHE_MANAGER.readFromCache(cacheKey, function(result) {
      if (result != null) {
        return res.json(result);
      }
      paymentVM.getAllPayment(construct, '', function(result) {
        if (result.data) {
          global.library.CACHE_MANAGER.storeCache(cacheKey, result, {});
          return res.json(result);
        }
        return res.json(result);
      });
    });
  },
  findRelated: function(req, res) {
    campaignVM.findRelated({}, function(result) {
      res.json(result);
    })
  }
};
module.exports = APIcampaignController;
