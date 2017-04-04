var model = require(GLOBAL_PATH + '/models/index');
// var slug = require('slugg');
var state = 'bankaccount';
const paymentAccountVM = require(GLOBAL_PATH + '/viewModel/paymentAccountVM.js');
var paymentAccountController = {
    index: function(req, res) {
        // var filter = 'bank _id';
        paymentAccountVM.getAllPaymentAccount({}, null, function(result) {
            res.render('backend/payment-account/index', {
                layout: 'backend/layout/base',
                title: 'Akun Bank',
                message: req.flash(state),
                data: result,
                state: state
            });
        });

    },
    add: function(req, res) {
        switch (req.method) {
            case 'GET':
                {
                    res.render('backend/payment-account/create', {
                        layout: 'backend/layout/base',
                        title: 'Tambah Akun Bank',
                        data: {},
                        state: state
                    });
                    break;
                }
            case 'POST':
                {
                    var bankConstructor = {};
                    bankConstructor.bank = {};
                    bankConstructor.merchant = req.body.merchant;
                    bankConstructor.paymentCategory = req.body.paymentCategory;
                    bankConstructor.merchant = req.body.merchant;
                    bankConstructor.bank['branchName'] = req.body.branchName
                        ? req.body.branchName
                        : '-';
                    bankConstructor.bank['name'] = req.body.bankName.replace(/_/g, ' ');
                    bankConstructor.bank['shortName'] = req.body.bankName;
                    bankConstructor.bank['holderName'] = req.body.name;
                    bankConstructor.bank['accNumber'] = req.body.accountNumber;
                    bankConstructor.description = req.body.description;
                    paymentAccountVM.createPaymentAccount(bankConstructor, function(result) {
                        var flashName = bankConstructor.bank['name'];
                        var globalStatus = (result.status === global.status.STATUS_FAILED) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                        var msg = (result.status === global.status.STATUS_FAILED) ? 'Gagal menambahkan akun bank' : 'Berhasil menambahkan akun bank ' + flashName;
                        global.library.FLASH(req, state, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/account');
                    });
                    break;
                }

        }
    },
    edit: function(req, res) {
        switch (req.method) {
            case 'GET':
                {
                    var construct = {};
                    construct._id = req.params.id;
                    paymentAccountVM.findPaymentAccount(construct, {}, function(result) {
                        res.render('backend/payment-account/create', {
                            layout: 'backend/layout/base',
                            title: 'Ubah Akun Bank',
                            data: result,
                            state: state
                        });
                    });
                    break;
                }
            case 'POST':
                {
                    var construct = {};
                    construct._id = req.params.id;
                    paymentAccountVM.findPaymentAccount(construct, {}, function(result) {
                        if (result.data) {
                            //  res.json(req.body);
                            var bankConstructor = {};
                            bankConstructor.bank = {};
                            bankConstructor.merchant = req.body.merchant;
                            bankConstructor.paymentCategory = req.body.paymentCategory;
                            bankConstructor.merchant = req.body.merchant;
                            bankConstructor.bank['branchName'] = req.body.branchName
                                ? req.body.branchName
                                : '-';
                            bankConstructor.bank['name'] = req.body.bankName.replace(/_/g, ' ');
                            bankConstructor.bank['shortName'] = req.body.bankName;
                            bankConstructor.bank['holderName'] = req.body.name;
                            bankConstructor.bank['accNumber'] = req.body.accountNumber;
                            bankConstructor.description = req.body.description;
                            model.paymentAccount.update({
                                '_id': req.params.id
                            }, bankConstructor, {
                                upsert: true
                            }, function(err) {
                                var flashName = bankConstructor.bank['name'];
                                var globalStatus = (err) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                                var msg = (err) ? 'Gagal merubah akun bank' : 'Berhasil merubah akun bank ' + flashName;
                                global.library.FLASH(req, state, globalStatus, msg);
                                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/account');
                            });
                        }
                    });
                    break;
                }
        }
    },
    delete: function(req, res) {
        switch (req.method) {
            case 'GET':
                {
                    var construct = {};
                    construct._id = req.params.id;
                    paymentAccountVM.findPaymentAccount(construct, {}, function(result) {
                        // res.json(result);
                        res.render('backend/payment-account/delete', {
                            layout: 'backend/layout/base',
                            title: 'Hapus Akun Bank',
                            data: result,
                            state: state
                        });
                    });
                    break;
                }
            case 'POST':
                {
                    var construct = {};
                    construct._id = req.body._id;
                    paymentAccountVM.findPaymentAccount(construct, {}, function(result) {
                        if (result.data) {
                            model.paymentAccount.remove({
                                _id: req.body._id
                            }, function(err) {
                                var flashName = result.data.bank.name;
                                var globalStatus = (err) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                                var msg = (err) ? 'Gagal menghapus akun bank' : 'Berhasil menghapus akun bank ' + flashName;
                                global.library.FLASH(req, state, globalStatus, msg);
                                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/account');
                            });
                        }
                    });
                    break;
                }
        }
    }
};
module.exports = paymentAccountController;
