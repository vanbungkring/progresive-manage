const models = require(GLOBAL_PATH + '/models/index');
const paymentVM = require(GLOBAL_PATH + '/viewModel/paymentVM.js');
const paymentConfirmationVM = require(GLOBAL_PATH + '/viewModel/paymentConfirmationVM.js');
const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const paymentReceiveVM = require(GLOBAL_PATH + '/viewModel/paymentReceiveVM.js');
// var slug = require('slugg');
// var state = '';
var paymentStatusController = {
    paidIndex: function(req, res) {
        var populate = [{
            path: 'campaign',
            model: 'campaign',
            select: '-postMeta.content -postMeta.image',
            populate: {
                path: 'bank',
                model: 'paymentAccount'
            }
        }, {
            path: 'userContext.user'
        }];
        var construct = {};
        var perPage = 10,
            page = req.body.page - 1 > 0 ? req.body.page - 1 : 0;
        construct.queryParameters = {};
        construct.queryParameters['status.code'] = 2;
        construct.perPage = perPage;
        construct.page = page;
        construct.populate = populate;
        construct.deepPopulate = 'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo';
        construct.filter = '-userContext';
        paymentVM.getAllPayment(construct, '', function(result) {
            res.render('backend/payment/paid', {
                layout: 'backend/layout/base',
                title: 'Paid Payment',
                data: result,
                state: 'paid',
            });
        });
    },
    unpaidIndex: function(req, res) {
        var populate = [{
            path: 'campaign',
            model: 'campaign',
            select: '-postMeta.content -postMeta.image',
            populate: {
                path: 'bank',
                model: 'paymentAccount'
            }
        }, {
            path: 'userContext.user'
        }];
        var construct = {};
        var perPage = 10,
            page = req.body.page - 1 > 0 ? req.body.page - 1 : 0;
        construct.queryParameters = {};
        construct.queryParameters['status.code'] = 1;
        construct.perPage = perPage;
        construct.page = page;
        construct.populate = populate;
        construct.deepPopulate = 'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo';
        construct.filter = '';
        paymentVM.getAllPayment(construct, '', function(result) {
            res.render('backend/payment/unpaid', {
                layout: 'backend/layout/base',
                title: 'Unpaid Payment',
                data: result,
                state: 'unpaid',
            });
        });

    },
    updatePaymentDetail: function(req, res) {
        paymentVM.findPayment({
            '_id': req.params.id
        }, function(result) {
            if (!result.data) {
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/unpaid');
            } else {
                var data = new models.payment();
                data = result.data;
                if (req.body.paymentStatus === global.status.STATUS_PAYMENT_STATUS_PAYMENT_APPROVED) {
                    global.library.ASYNC.waterfall([
                        function(callback) {
                            var date = new Date(global.library.MOMENT(req.body.approvalDate, 'MM/DD/YYYY').format('MM/DD/YYYY 00:00:00')).toISOString();
                            var formattedAmountIDR = global.library.NUMERAL(req.body.actualAmount).format('0,0').toString();
                            var fee = parseFloat(GLOBAL_CONFIG.app.platformFee) / 100 * parseFloat(req.body.actualAmount);
                            var nettAmount = parseFloat(parseFloat(req.body.actualAmount) - fee);
                            var constructor = {};
                            constructor.transactionContext = {};
                            constructor.transactionContext.payment = req.params.id;
                            constructor.transactionContext.bankInfo = req.body.bankId;
                            constructor.transactionContext.paymentReceiveDate = date;
                            constructor.transactionContext.amount = req.body.actualAmount;
                            constructor.transactionContext.platformFee = fee;
                            constructor.transactionContext.nettAmount = nettAmount;
                            constructor.transactionContext.formattedAmountIDR = formattedAmountIDR;
                            constructor.operator = req.user._id;
                            constructor.donor = req.body.donor;
                            constructor.campaign = req.body.campaign;
                            paymentReceiveVM.createPaymentReceive(constructor, function(result) {
                                if (result.status === global.status.STATUS_SUCCESS) {
                                    data.transactionContext.paymentReceive = result.data._id;
                                    global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_HISTORY+'*');
                                    callback(null, result.data);
                                } else {
                                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/unpaid');
                                }
                            });
                        },
                        function(arg1, callback) {
                            var paymentReceive = [];
                            paymentReceiveVM.getAllPaymentReceive({
                                'campaign': arg1.campaign
                            }, function(result) {
                                var totalAmountCampaign = 0;
                                for (var i = 0; i < result.data.length; i++) {
                                    totalAmountCampaign += result.data[i].transactionContext.amount;
                                    paymentReceive.push(result.data[i]._id);
                                }
                                campaignVM.findCampaign({
                                    '_id': arg1.campaign
                                }, function(campaignData) {
                                    if (result.status === global.status.STATUS_FAILED) {
                                        return res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign');
                                    }
                                    var construct = new models.campaign();
                                    construct = campaignData.data;
                                    construct.fundRaisingProgress = totalAmountCampaign;
                                    construct.paymentReceive = paymentReceive;
                                    construct.save(function(err, result) {
                                          global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN+'*');
                                        callback(null, totalAmountCampaign);
                                    });
                                });
                            });
                        },
                    ], function(err, result) {
                        data.status.message = req.body.paymentStatus;
                        data.fundRaisingProgress = result;
                        data.status.code = 2;
                        data.save(function(err, result) {
                          global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_HISTORY+'*');
                            res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/unpaid');
                        });
                        // result now equals 'done'
                    });
                } else {
                    data.status.message = req.body.paymentStatus;
                    data.save(function(err, result) {
                      global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_HISTORY+'*')
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/unpaid');
                    });
                }
            }
        });
    },
    unpaidDetail: function(req, res) {
        var construct = {};
        construct.queryParameters = {};
        construct.queryParameters._id = req.params.id;
        construct.populate = '';
        construct.filter = '';
        construct.deepPopulate = 'transactionContext.bankInfo campaign';
        global.library.ASYNC.parallel({
            transaction: function(callback) {
                paymentVM.findPayment(construct, function(result) {
                    callback(null, result);
                });
            },
            paymentConfirmation: function(callback) {
                paymentConfirmationVM.getAllPaymentConfirmation({
                    'transactionContext.payment': req.params.id
                }, {}, function(result) {
                    callback(null, result);
                });
            }
        }, function(err, result) {
            var page = 'backend/payment/unpaidDetail';
            if (req.params.type != 'program') {
                page = 'backend/payment/unpaidZISDetail';
            }
            res.render(page, {
                layout: 'backend/layout/base',
                title: 'Transaction Detail',
                data: result,
                state: 'unpaid',
            });
            // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
        });
    }
};
module.exports = paymentStatusController;
