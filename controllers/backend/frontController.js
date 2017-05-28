const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const frontVM = require(GLOBAL_PATH + '/viewModel/frontPageVM.js');
var frontController = {
    home: function(req, res) {
      var context  = {}
      getFront({},function(result){
        res.render('backend/front/home', {
            layout: 'backend/layout/front',
            title: 'Serambi',
            seo:false,
            data: result
        });
        res.json(result);
      })
    },
    findByCategory:function(req,res){

    },
    findBySlugg: function(req, res) {
      console.log(req.param);
        var populate = [
            {
                path: 'campaignCategory',
                select: 'name _id'
            },  {
                  path: 'author',
                  select: 'name _id'
              }, {
                path: 'writer',
                select: '_id firstName lastName'
            }, {
                path: 'bank',
                select: 'bank'
            }
        ];
        if (req.body.appToken) {
            delete req.body.appToken;
        }
        if (!req.params.id) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_PARAMETERS_CAMPAIGN_ID_REQUIRED_MESSAGE, null));
        }
        // console.log(req.body);
        var construct = {};
        construct.queryParameters = {};
        construct.populate = populate;
        construct.queryParameters['postMeta.slug'] = req.params.id;
        campaignVM.findCampaign(construct, function(result) {
            return res.render('backend/front/detail', {
                layout: 'backend/layout/front',
                title: result.data.postMeta.title,
                seo:true,
                data: result
            });
        });
    }
}
function getFront(context,callback){
  var populate = [
      {
          path: 'campaignCategory',
          select: 'name _id'
      },
      {
          path: 'author',
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
      }
  ];
  var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN;
  var construct = {};
  var perPage = 8;

  page = parseInt(context.page) - 1 > 0
      ? parseInt(context.page) - 1
      : 0;
  construct.queryParameters = {};
  if (context.perpage != undefined) {
      cacheKey += 'PERPAGE_' + context.perpage + '_';
  }
  cacheKey += 'PAGE_' + page + '_';
  construct.queryParameters.publishedStatus = 1;
  if (context.category) {
      construct.queryParameters.campaignCategory = global.library.MONGOOOSE.Types.ObjectId(context.category);
      cacheKey += 'CATEGORY_' + context.category + '_';
  }

  construct.perPage = perPage;
  construct.populate = populate;
  construct.featured = true;
  construct.page = page;
  construct.deepPopulate = 'merchant';
  construct.filter = ' -postMeta.tag  -__v -publishedStatus -updatedAt';
  global.library.CACHE_MANAGER.readFromCache(cacheKey, function(result) {
      if (result != null) {
        callback(result);
      }
      campaignVM.getAllCampaign(construct, '-password', function(queryResult) {
          if (queryResult.data) {
              global.library.CACHE_MANAGER.storeCache(cacheKey, queryResult, {});
          }
          callback(queryResult);

      });
  });

}

module.exports = frontController;
