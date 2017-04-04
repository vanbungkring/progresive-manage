const model = require(GLOBAL_PATH + '/models/index');
const paymentVM = require(GLOBAL_PATH + '/viewModel/paymentVM.js');
const paymentConfirmationVM = require(GLOBAL_PATH + '/viewModel/paymentConfirmationVM.js');
const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const paymentReceiveVM = require(GLOBAL_PATH + '/viewModel/paymentReceiveVM.js');

var newPaymentStatusController = {
    internalDonation: function(req, res) {
        res.render('backend/payment/internal/index', {
            layout: 'backend/layout/base',
            title: 'Donasi Internal',
            message: req.flash('internal'),
            state: 'internal',
        });
    },
    index: function(req, res, next) {
        var code;
        if (req.params.paymentType === 'paid') {
            code = 2;
        } else if (req.params.paymentType === 'unpaid') {
            code = 1;
        } else {
            next();
        }
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
        var perPage = 100000,
            page = req.body.page - 1 > 0 ? req.body.page - 1 : 0;
        construct.queryParameters = {};
        construct.queryParameters['status.code'] = code;
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
                state: req.params.paymentType,
            });
        });
    },
    paymentDetail: function(req, res, next) {
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
                    //  res.json(result);
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
            var page;
            if (req.params.type === 'program') {
                page = 'backend/payment/unpaidDetail';
            } else if (req.params.type === 'zakat' || 'infaq' || 'sodaqoh' || 'wakaf') {
                page = 'backend/payment/unpaidZISDetail';
            } else {
                return next();
            }
            res.render(page, {
                layout: 'backend/layout/base',
                title: 'Transaction Detail',
                data: result,
                state: req.params.paymentType,
            });
            // results is now equals to: {one: 'abc\n', two: 'xyz\n'}
        });
    },
    updatePayment: function(req, res, next) {
        var construct = {};
        construct.queryParameters = {};
        construct.queryParameters._id = req.body._id;
        construct.populate = '';
        construct.filter = '';
        construct.deepPopulate = 'transactionContext.bankInfo campaign';
        paymentVM.findPayment(construct, function(result) {
            if (!result.data) {
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/' + req.params.paymentType);
            }
            var data = result.data;
            var resultUserContext = result.data.userContext.appToken;
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
                                if (req.params.type === 'program') {
                                    data.transactionContext.paymentReceive = result.data._id;
                                    callback(null, result.data);
                                } else {
                                    data.status.message = req.body.paymentStatus;
                                    data.fundRaisingProgress = result;
                                    data.transactionContext.paymentReceive = result.data._id;
                                    data.status.code = 2;
                                    model.payment.update({
                                        '_id': data._id
                                    }, data, {
                                        upsert: true
                                    }, function(err) {
                                        var globalStatus = err ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                                        var msg = err ? 'Gagal merubah transaksi' : 'Berhasil merubah transaksi ';
                                        global.library.FLASH(req, req.params.paymentType, globalStatus, msg);
                                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/' + req.params.paymentType);
                                    });
                                }

                            } else {
                                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/' + req.params.paymentType);
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
                            var constructCampaign = {};
                            constructCampaign.queryParameters = {};
                            constructCampaign.queryParameters._id = arg1.campaign;

                            campaignVM.findCampaign(constructCampaign, function(campaignData) {
                                if (result.status === global.status.STATUS_FAILED) {
                                    return res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign');
                                }
                                construct = campaignData.data;
                                construct.fundRaisingProgress = totalAmountCampaign;
                                construct.paymentReceive = paymentReceive;
                                model.campaign.update({
                                    '_id': arg1.campaign
                                }, construct, {
                                    upsert: true
                                }, function(err) {
                                    if (!err) {
                                        global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN + "*");
                                        return callback(null, totalAmountCampaign);
                                    }
                                    ///update chache campaign Here
                                    var globalStatus = global.status.STATUS_FAILED;
                                    var msg = 'Gagal merubah transaksi';
                                    global.library.FLASH(req, req.params.paymentType, globalStatus, msg);
                                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/' + req.params.paymentType);
                                });
                            });
                        });
                    },
                ], function(err, result) {
                    data.status.message = req.body.paymentStatus;
                    data.fundRaisingProgress = result;
                    data.status.code = 2;
                    model.payment.update({
                        '_id': data._id
                    }, data, {
                        upsert: true
                    }, function(err) {
                      if (!err) {
                        var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_HISTORY;
                        cacheKey += '_TOKEN_' + resultUserContext+ '*';
                        global.library.CACHE_MANAGER.deleteCache(cacheKey);
                      }
                        var globalStatus = err ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                        var msg = err ? 'Gagal merubah transaksi' : 'Berhasil merubah transaksi ';
                        global.library.FLASH(req, req.params.paymentType, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/' + req.params.paymentType);
                    });
                    // result now equals 'done'
                });
            } else {
                data.status.message = req.body.paymentStatus;
                model.payment.update({
                    '_id': data._id
                }, data, {
                    upsert: true
                }, function(err) {
                  if(!err) {
                    var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_HISTORY;
                    cacheKey += '_TOKEN_' + resultUserContext + '*';
                    global.library.CACHE_MANAGER.deleteCache(cacheKey);
                  }
                    var globalStatus = err ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                    var msg = err ? 'Gagal merubah transaksi' : 'Berhasil merubah transaksi ';
                    global.library.FLASH(req, req.params.paymentType, globalStatus, msg);
                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/' + req.params.paymentType);
                });
            }
        });
    }
};
module.exports = newPaymentStatusController;
