const paymentAccountVM = require(GLOBAL_PATH + '/viewModel/paymentAccountVM.js');
const output = require(GLOBAL_PATH + '/helper/output.js');
var paymentMethodController = {
  index: function(req, res) {
    var construct = {};
    var filter = 'bank _id';
    if (!req.body.campaignId) {
      return res.json(output(global.status.STATUS_PARAMETERS_PAYMENT_CATEGORY_REQUIRED, global.status.STATUS_PARAMETERS_PAYMENT_CATEGORY_REQUIRED_MESSAGE, null));
    } else if (!req.body.merchant) {
      return res.json(output(global.status.STATUS_PARAMETERS_MERCHANT_REQUIRED, global.status.STATUS_PARAMETERS_MERCHANT_REQUIRED_MESSAGE, null));
    } else if (!req.body.amount) {
      return res.json(output(global.status.STATUS_PARAMETERS_AMOUNT_REQUIRED, global.status.STATUS_PARAMETERS_AMOUNT_REQUIRED_MESSAGE, null));
    }
    construct = {
      'paymentCategory': {
        $in: [global.library.MONGOOOSE.Types.ObjectId(req.body.paymentCategory)]
      },
      'merchant': global.library.MONGOOOSE.Types.ObjectId(req.body.merchant)
    };
    paymentAccountVM.getAllPaymentAccount(construct, filter, function(result) {
      return res.json(result);
    });
  }

};
module.exports = paymentMethodController;
