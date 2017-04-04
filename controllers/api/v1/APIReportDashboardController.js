const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const donorVM = require(GLOBAL_PATH + '/viewModel/donorVM.js');
const campaignUpdateVM = require(GLOBAL_PATH + '/viewModel/campaignUpdateVM.js');
const output = require(GLOBAL_PATH + '/helper/output.js');
const model = require(GLOBAL_PATH + '/models/index');

var APIReportDashboardController = {
    dashboardUserCount: function(req, res) {
        model.donor.find({}).count().exec(function(err, result) {
            return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS, result));
        })
    },
    /**
     * this method is for getting payment unpaid, need to revisit
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    dahboardTotalPayment: function(req, res) {
        model.payment.aggregate([{
            $match: {
                'status.code': parseInt(req.body.status ? req.body.status : 1)
            }
        }, {
            $group: {
                _id: '$id',
                total: {
                    $sum: '$transactionContext.totalAmount'
                }
            }
        }]).exec(function(err, result) {
            if (err) {
                return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_FAILED_MESSAGE, {}));
            }
            res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result.length ? result[0] : {}));
        })
    },
    dashboardFinancialReport: function(req, res) {
        model.payment.aggregate([{
            $match: {
                'status.code': parseInt(req.body.status ? req.body.status : 1)
            }
        }, {
            $group: {
                _id: '$id',
                total: {
                    $sum: '$transactionContext.totalAmount'
                }
            }
        }]).exec(function(err, result) {
            if (err) {
                return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_FAILED_MESSAGE, {}));
            }
            res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result.length ? result[0] : {}));
        })
    }
}
module.exports = APIReportDashboardController;
