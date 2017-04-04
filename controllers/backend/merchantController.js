const merchantVM = require(GLOBAL_PATH + '/viewModel/merchantVM.js');
// const model = require(GLOBAL_PATH + '/models/index.js');
var state = 'submerchant';
var merchantController = {
    index: function(req, res) {
        var construct = {};
        construct.type = 2;
        construct.status = true,
            merchantVM.getAllSubmerchant(construct, function(result) {
                res.render('backend/merchant/index', {
                    layout: 'backend/layout/base',
                    title: 'Merchant',
                    data: result,
                    state: state,
                });
            });
    },
    add: function(req, res) {
        if (req.method == 'POST') {
            if (req.body._id.length > 0) {
                res.redirect('/');
            } else {
                req.body.type = 2;
                //console.log(req.body);
                merchantVM.createNewMerchant(req.body, function(result) {
                    if (result) {
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/submerchant');
                    }
                });
            }
        } else {
            res.render('backend/merchant/create', {
                layout: 'backend/layout/base',
                title: 'Merchant Settings',
                data: {},
                state: state,
            });
        }
    },
    parentSettings: function(req, res) {
        if (req.method == 'POST') {
            if (req.body._id.length > 0) {
                req.body.type = 1;
                //console.log(req.body);
                merchantVM.updateMerchant(req.body, function(result) {
                    if (result) {
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/merchant/settings');
                    }
                });
            } else {
                req.body.type = 1;
                merchantVM.createNewMerchant(req.body, function(result) {
                    if (result) {
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/merchant/settings');
                    }
                });
            }
        } else {
            merchantVM.getParentMerchant(function(result) {
                res.render('backend/merchant/create', {
                    layout: 'backend/layout/base',
                    title: 'Merchant Settings',
                    data: result,
                    state: state,
                });
            });
        }
    },
    edit: function(req, res) {
        if (req.method == 'POST') {
            if (req.body._id.length > 0) {
                merchantVM.updateMerchant(req.body, function(result) {
                    if (result) {
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/submerchant');
                    }
                });
            } else {
                merchantVM.createNewMerchant(req.body, function(result) {
                    if (result) {
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/submerchant');
                    }
                });
            }
        } else {
            merchantVM.getMerchantById(req.params.id, function(result) {
                res.render('backend/merchant/create', {
                    layout: 'backend/layout/base',
                    title: 'Merchant Settings',
                    data: result,
                    state: state,
                });
            });

        }
    }
};
module.exports = merchantController;
