const campaignUpdateVM = require(GLOBAL_PATH + '/viewModel/campaignUpdateVM.js');
const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const model = require(GLOBAL_PATH + '/models/index');
var categoriesController = {
  index: function(req, res) {
    var construct = {};
    construct.queryParameters = {};
    construct.queryParameters.campaign = req.params.id;
    campaignUpdateVM.getAllCampaignUpdate(construct, function(result) {
      res.render('backend/campaign-update/index', {
        layout: 'backend/layout/base',
        title: 'Campaign Update',
        data: result,
        identifier: req.params.id
      });
    });
  },
  add: function(req, res) {
    if (req.method == 'POST') {
      var construct = {};
      construct.postMeta = {};
      construct.campaign = req.params.id;
      construct.postMeta.title = req.body.title;
      construct.postMeta.content = req.body.content;
      construct.writer = req.user._id;
      construct.postMeta.slug = global.library.SLUGG(req.body.title);
      // console.log(construct);
      //console.log(construct);
      global.library.ASYNC.waterfall([
        function(callback) {
          campaignUpdateVM.createCampaignUpdate(construct, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
              return res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign/' + req.params.id + '/update');
            } else {
              var construct = {};
              construct.queryParameters = {};
              construct.queryParameters.campaign = req.params.id;
              construct.filter = '_id';
              campaignUpdateVM.getAllCampaignUpdate(construct, function(results) {
                callback(null, results);
              })
              //callback(null, result);
            }
          });
        },
        function(result, callback) {
          var updatedCampaign = [];
          for (var i = 0; i < result.data.length; i++) {
            updatedCampaign.push(result.data[i]._id);
          }
          var constructParams = {};
          constructParams.queryParameters = {};
          constructParams.queryParameters._id = req.params.id;
          campaignVM.findCampaign(constructParams, function(results) {
            var models = {};
            models = results.data;
            models.campaignUpdate = updatedCampaign;
            model.campaign.update({
              '_id': req.params.id
            }, models, {
              upsert: true
            }, function(err) {
              if (!err) {
                global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN + "*");
              }
              callback(results)
            });
          });

        }
      ], function(result) {
        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign/' + req.params.id + '/update');
      });

    } else {
      res.render('backend/campaign-update/create', {
        layout: 'backend/layout/base',
        title: 'Update campaign',
      });
    }

  }
};
module.exports = categoriesController;
