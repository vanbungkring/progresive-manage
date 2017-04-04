const paymentCategoryVM = require(GLOBAL_PATH + '/viewModel/paymentCategoryVM.js');
var paymentCategoryController = {
  index: function(req, res) {
    var construct = {};
    var populate = [{
      path: 'bank',
      select: 'bank',
      select: '-updatedAt -createdAt -active  -paymentCategory -description -type -__v -merchant'
    }];
    //'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo'
    construct.queryParameters = {};
    construct.queryParameters.status = 1;
    construct.populate = populate;
    construct.filter = '_id name bank description';
    construct.deepPopulate = '';
    if (req.body.paymentName == undefined) {
      paymentCategoryVM.getAllPaymentCategory(construct, function(result) {
        return res.json(result);
      });
    } else {
      construct.queryParameters.name = req.body.paymentName.toUpperCase();
      paymentCategoryVM.getSinglePaymentCategory(construct, function(result) {
        return res.json(result);
      });
    }
  }

};
module.exports = paymentCategoryController;
