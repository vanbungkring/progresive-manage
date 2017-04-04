const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
const paymentCategoryVM = require(GLOBAL_PATH + '/viewModel/paymentCategoryVM.js');
var reportController = {
  unpaidPaymentAll: function(req, res) {},
  totalPaidPayment: function(req, res) {

  },
  totalRevenueTotal: function(req, res) {},

  /**
   * need refactor this in th future
   */
  userDonationReport: function(req, res) {
    var startDate = req.body.startDate ? global.library.MOMENT.utc(req.body.startDate).toDate() : global.library.MOMENT.utc().startOf('year').toDate();
    var endDate = req.body.endDate ? global.library.MOMENT.utc(req.body.endDate).endOf('day').toDate() : global.library.MOMENT.utc(new Date()).endOf('day').toDate();
    if (!req.body.appToken) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_REQUIRED_MESSAGE, null));
    }
    global.library.ASYNC.waterfall([
      function(callback) {
        model.payment.aggregate([{
          $match: {
            'status.code': 2,
            'createdAt': {
              $gte: startDate,
              $lt: endDate
            },
            'userContext.appToken': req.body.appToken
          }
        }, {
          $group: {
            _id: '$paymentType',
            total: {
              $sum: '$transactionContext.totalAmount'
            }
          }
        }]).exec(function(err, result) {
          if (err) {
            callback(null, [])
          } else {
            callback(null, result);
          }
        })
      },
      function(arg1, callback) {
        var construct = {};
        var populate = [{
          path: 'bank',
          select: 'bank',
          select: '-updatedAt -createdAt -active  -paymentCategory -description -type -__v -merchant -bank -_id -description'
        }];
        //'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo'
        construct.queryParameters = {};
        construct.queryParameters.status = 1;
        construct.populate = populate;
        construct.filter = 'name';
        construct.deepPopulate = '';
        var outputSanitize = [];
        console.log(arg1);
        paymentCategoryVM.getAllPaymentCategory(construct, function(result) {
          if (result.data != null) {
            ///do payment indexing standarize
            var cleanPaymentArray = [];
            cleanPaymentArray.push({
              '_id': 'program',
              'total': 0
            })
            for (var i = 0; i < result.data.length; i++) {
              cleanPaymentArray.push({
                '_id': result.data[i].name.toLowerCase(),
                'total': 0
              })
            }

            mergeByProperty(cleanPaymentArray, arg1, '_id');
            callback(cleanPaymentArray);
          }
        });

      }
    ], function(done) {
      return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS, done));
    });
  }
}

function mergeByProperty(arr1, arr2, prop) {
  global._.each(arr2, function(arr2obj) {
    var arr1obj = global._.find(arr1, function(arr1obj) {
      return arr1obj[prop] === arr2obj[prop];
    });

    //If the object already exist extend it with the new values from arr2, otherwise just add the new object to arr1
    arr1obj ? global._.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
  });
}

module.exports = reportController;
