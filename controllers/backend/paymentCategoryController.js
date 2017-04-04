const model = require(GLOBAL_PATH + '/models/index');
const paymentCategoryVM = require(GLOBAL_PATH + '/viewModel/paymentCategoryVM.js');
// var slug = require('slugg');
var state = 'paymenttype';
var paymentCategoryController = {

    index: function(req, res) {

        var populate = [{
            path: 'bank',
            select: 'bank',
            select: '-updatedAt -createdAt -active   -description -type -__v -merchant'
        }];
        // 'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo'
        var construct = {};
        construct.queryParameters = {};
        construct.populate = populate;
        construct.filter = '';
        construct.deepPopulate = '';

        paymentCategoryVM.getAllPaymentCategory(construct, function(result) {
            // res.json(result);
            res.render('backend/payment-category/index', {
                layout: 'backend/layout/base',
                title: 'Jenis Pembayaran',
                message: req.flash(state),
                data: result,
                state: state,
            });
        });
    },
    add: function(req, res) {
        switch (req.method) {
            case 'GET': {
                res.render('backend/payment-category/create', {
                    layout: 'backend/layout/base',
                    title: 'Tambah Jenis Pembayaran',
                    data: {},
                    state: state,
                });
                break;
            }
            case 'POST': {
                // console.log(req.body);
                var paymentConstructor = {};
                var paymentStatus = true;
                if (!req.body.status) {
                    paymentStatus = false;
                }
                paymentConstructor.name = req.body.name;
                paymentConstructor.icon = req.body.name.toLowerCase();
                paymentConstructor.description = req.body.description;
                paymentConstructor.customfield = req.body.customfield ? req.body.customfield : '';
                paymentConstructor.type = req.body.type ? 1 : 2,
                paymentConstructor.status = paymentStatus;
                paymentConstructor.bank = req.body.bank;
                paymentCategoryVM.createPaymentcategory(paymentConstructor, function(result) {
                    if (result) {
                        //res.json(result);
                        var globalStatus = (result.status === global.status.STATUS_FAILED) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                        var msg = (result.status === global.status.STATUS_FAILED) ? 'Gagal menambahkan jenis pembayaran' : 'Berhasil menambahkan jenis pembayaran ' + req.body.name;
                        global.library.FLASH(req, state, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/category');
                    }
                });
                break;
            }

        }
    },
    edit: function(req, res) {
      var construct = {};
      construct.queryParameters = {};
      construct.queryParameters._id = req.params.id;
        switch (req.method) {
            case 'GET':
                {
                    paymentCategoryVM.getSinglePaymentCategory(construct, function(result) {
                        res.render('backend/payment-category/create', {
                            layout: 'backend/layout/base',
                            title: 'Ubah Jenis Pembayaran',
                            data: result,
                            state: state,
                        });
                    });
                    break;
                }
            case 'POST':
                {
                    paymentCategoryVM.getSinglePaymentCategory(construct, function(result) {
                        if (result.status === global.status.STATUS_FAILED) {
                            return res.json(result);
                        } else {
                            var paymentStatus = true;
                            if (!req.body.status) {
                                paymentStatus = false;
                            }
                            var construct = {};
                            construct = result.data;
                            construct.name = req.body.name;
                            construct.creator = req.body.creator;
                            construct.accountNumber = req.body.accountNumber;
                            construct.merchant = req.body.merchant;
                            construct.description = req.body.description;
                            construct.customfield = req.body.customfield;
                            construct.type = req.body.type ? 1 : 2;
                            construct.status = paymentStatus;
                            model.paymentCategory.update({
                                '_id': req.params.id
                            }, construct, {
                                upsert: true
                            }, function(err) {
                                var globalStatus = err ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                                var msg = err ? 'Gagal merubah jenis pembayaran' : 'Berhasil merubah jenis pembayaran ' + req.body.name;
                                global.library.FLASH(req, state, globalStatus, msg);
                                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/category');
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
                  var constructParams = {};
                  constructParams.queryParameters = {};
                  constructParams.queryParameters._id = req.params.id;
                    paymentCategoryVM.getSinglePaymentCategory(constructParams, function(result) {
                        res.render('backend/payment-category/delete', {
                            layout: 'backend/layout/base',
                            title: 'Hapus Jenis Pembayaran',
                            data: result,
                            state: state,
                        });
                    });
                    break;
                }
            case 'POST':
                {
                  var constructParams = {};
                  constructParams.queryParameters = {};
                  constructParams.queryParameters._id = req.body._id;
                  paymentCategoryVM.getSinglePaymentCategory(constructParams, function(result) {
                      if (result.data) {
                          model.paymentCategory.remove({
                              _id: req.body._id
                          }, function(err) {
                            var globalStatus = err ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                            var msg = err ? 'Gagal menghapus jenis pembayaran' : 'Berhasil menghapus jenis pembayaran ' + result.name;
                            global.library.FLASH(req, state, globalStatus, msg);
                            res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/payment/category');
                          });
                      }
                  });
                    break;
                }
        }
    }
};
module.exports = paymentCategoryController;
