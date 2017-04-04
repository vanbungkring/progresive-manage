const paymentAccountVM = require(GLOBAL_PATH + '/viewModel/paymentAccountVM.js');
var paymentAccountController = {
    index: function(req, res) {
        var construct = {};
        construct.active = 1;
        paymentAccountVM.getAllPaymentAccount(construct, {}, function(result) {
            return res.json(result);
        });
    }

};
module.exports = paymentAccountController;
