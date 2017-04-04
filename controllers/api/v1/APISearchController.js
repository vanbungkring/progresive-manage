const output = require(GLOBAL_PATH + '/helper/output.js');
const model = require(GLOBAL_PATH + '/models/index');
var searchController = {

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
      options: { sort: { 'createdAt':-1} },
      populate: {
        path: 'transactionContext.payment',
        model: 'payment',
        select: 'transactionContext.totalAmount userContext.anonymous userContext.donor userContext.remarks',
        populate: {
          path: 'userContext.donor',
          model: 'donor',
          select: 'name'
        }
      }
    }, {
      path: 'bank',
      select: 'bank'
    }];
    model.campaign
      .find({
        $text: {
          $search: req.body.keyword
        }
      })
      .where({
        'publishedStatus': 1
      })
      .populate(populate)
      .select('-postMeta.content')
      .limit(20)
      .exec(function(err, result) {
        if (err) {
          return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_FAILED_MESSAGE, err));
        }
        res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
      });
  }
};
module.exports = searchController;
