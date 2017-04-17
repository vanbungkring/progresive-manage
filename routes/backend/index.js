var controllers = require(GLOBAL_PATH + '/controllers/backend/index');
var Agendash = require('agendash');
module.exports = function(app, passport) {
    app
      .get('/',controllers.frontController.home)
      .get('/content/video/:id',controllers.frontController.findBySlugg);
    app
        .get('/login', isLoggedIn, controllers.authController.login)
        .post('/login', isLoggedIn, passport.authenticate('local-login', {
            successRedirect: PREFIX_ROUTE_BACK_OFFICE + '/campaign', // redirect to the secure profile section
            failureRedirect: 'http://midtrans.co', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }))
        .get('/account/confirmation', isLoggedIn, controllers.authController.confirmation)
        .all('*', function(req, res, next) {
            if (req.isAuthenticated()) {
                return next();
            } else {
                res.redirect('/');
            }
        })
        .get('/dashboard', controllers.dashboardController.index)
        .get('/logout', controllers.authController.logout);
    app
        .use('/agendash', Agendash(global.library.AGENDA_MANAGER, {
            middleware: 'express'
        }))
        .get('/user', [hasAccessLevel('admin'), controllers.userController.index])
        .get('/user/add', [hasAccessLevel('admin'), controllers.userController.add])
        .post('/user/add', [hasAccessLevel('admin'), controllers.userController.add])
        .get('/user/edit/:id', [hasAccessLevel('admin'), controllers.userController.edit])
        .post('/user/edit/:id', [hasAccessLevel('admin'), controllers.userController.edit])
        .get('/user/delete/:id', [hasAccessLevel('admin'), controllers.userController.delete])
        .post('/user/delete/:id', [hasAccessLevel('admin'), controllers.userController.delete]);
    app
        .get('/me/edit/', controllers.userController.edit)
        .post('/me/edit/', controllers.userController.edit)
        .get('/me/changepassword', controllers.userController.changepassword)
        .post('/me/changepassword', controllers.userController.changepassword);
    app
        .get('/merchant/settings', [hasAccessLevel('admin'), controllers.merchantController.parentSettings])
        .post('/merchant/settings', [hasAccessLevel('admin'), controllers.merchantController.parentSettings]);
    app
        .get('/campaign/', controllers.campaignController.index)
        .get('/campaign/add', controllers.campaignController.add)
        .post('/campaign/add', controllers.campaignController.add)
        .get('/campaign/edit/:id', controllers.campaignController.edit)
        .post('/campaign/edit/:id', controllers.campaignController.edit)
        .get('/campaign/delete/:id', controllers.campaignController.delete)
        .post('/campaign/delete/:id', controllers.campaignController.delete)
        .get('/campaign/:id/update', controllers.campaignUpdateController.index)
        .get('/campaign/:id/update/add', controllers.campaignUpdateController.add)
        .post('/campaign/:id/update/add', controllers.campaignUpdateController.add);
    app
        .get('/submerchant/', controllers.merchantController.index)
        .get('/submerchant/add', controllers.merchantController.add)
        .post('/submerchant/add', controllers.merchantController.add)
        .get('/submerchant/edit/:id', controllers.merchantController.edit)
        .post('/submerchant/edit/:id', controllers.merchantController.edit);
    app
        .get('/operator/', controllers.operatorController.index)
        .get('/operator/add', controllers.operatorController.add)
        .post('/operator/add', controllers.operatorController.add)
        .get('/operator/edit/:id', controllers.operatorController.edit)
        .post('/operator/edit/:id', controllers.operatorController.edit);
    app
        .get('/payment/:paymentType(paid|unpaid)', controllers.newPaymentStatusController.index)
        .get('/payment/:paymentType(paid|unpaid)/:type(zakat|infaq|sodaqoh|wakaf|program)/:id', controllers.newPaymentStatusController.paymentDetail)
        .post('/payment/:paymentType(paid|unpaid)/:type(zakat|infaq|sodaqoh|wakaf|program)/:id', controllers.newPaymentStatusController.updatePayment)
        .get('/payment/category', controllers.paymentCategoryController.index)
        .get('/payment/internal', controllers.newPaymentStatusController.internalDonation)
        .get('/payment/category/add', controllers.paymentCategoryController.add)
        .post('/payment/category/add', controllers.paymentCategoryController.add)
        .get('/payment/category/edit/:id', controllers.paymentCategoryController.edit)
        .post('/payment/category/edit/:id', controllers.paymentCategoryController.edit)
        .get('/payment/category/delete/:id', controllers.paymentCategoryController.delete)
        .post('/payment/category/delete/:id', controllers.paymentCategoryController.delete)
        .get('/payment/account/', controllers.paymentAccountController.index)
        .get('/payment/account/add', controllers.paymentAccountController.add)
        .post('/payment/account/add', controllers.paymentAccountController.add)
        .get('/payment/account/edit/:id', controllers.paymentAccountController.edit)
        .post('/payment/account/edit/:id', controllers.paymentAccountController.edit)
        .get('/payment/account/delete/:id', controllers.paymentAccountController.delete)
        .post('/payment/account/delete/:id', controllers.paymentAccountController.delete);
    app
        .get('/categories/', controllers.categoriesController.index)
        .get('/categories/add', controllers.categoriesController.add)
        .post('/categories/add', controllers.categoriesController.add)
        .get('/categories/edit/:id', controllers.categoriesController.edit)
        .post('/categories/edit/:id', controllers.categoriesController.edit)
        .get('/categories/delete/:id', controllers.categoriesController.delete)
        .post('/categories/delete/:id', controllers.categoriesController.delete);
    app
        .get('/author/', controllers.authorController.index)
        .get('/author/add', controllers.authorController.add)
        .post('/author/add', controllers.authorController.add)
        .get('/author/edit/:id', controllers.authorController.edit)
        .post('/author/edit/:id', controllers.authorController.edit)
        .get('/author/delete/:id', controllers.authorController.delete)
        .post('/author/delete/:id', controllers.authorController.delete);
    app
        .get('/donor/', controllers.donorController.index)
        .get('/donor/add', controllers.donorController.add)
        .post('/donor/add', controllers.donorController.add)
        .get('/donor/edit/:id', controllers.donorController.edit)
        .post('/donor/edit/:id', controllers.donorController.edit)
        .get('/donor/delete/:id', controllers.donorController.delete)
        .post('/donor/delete/:id', controllers.donorController.delete);
    app
        .get('/restricted/', controllers.authController.restricted);
};
// route middleware to ensure user is logged in
function isLoggedIn(req, res, next, app) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/');
    }
}

function hasAccessLevel(accessLevel) {
    return function(req, res, next) {
        if (req.user && req.user.hasAccess(accessLevel)) {
            return next();
        }
        res.redirect('/restricted');
    };
}
