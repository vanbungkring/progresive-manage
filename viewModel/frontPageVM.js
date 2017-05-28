const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
module.exports = {
    getSpecificCategoryFront: getSpecificCategoryFront
};
function getSpecificCategoryFront(context, callback) {
    var populate = [
        {
            path: 'campaignCategory',
            select: 'name _id'
        }, {
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
    // console.log(context);
    if (context.featured) {
        construct.queryParameters.featured = context.featured;
        cacheKey += 'FEATURED_';
    }
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
        });
    });
}
