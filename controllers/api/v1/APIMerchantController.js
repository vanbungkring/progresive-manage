var merchantVM = require(GLOBAL_PATH + '/viewModel/merchantVM');
const output = require(GLOBAL_PATH + '/helper/output.js');
var merchantController = {
    index: function(req, res) {
        var construct = {};
        merchantVM.getAllSubmerchant(construct, function(result) {
            return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS, result));
        });
    }
};
module.exports = merchantController;