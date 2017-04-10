var controllers = require(GLOBAL_PATH + '/controllers/api/v1/index');
module.exports = function(app, auth) {
  // console.log(auth);
  /**
   * user routes
   */
  app
    .post('/v1/user/login', auth, controllers.APIDonorController.login)
    .post('/v1/user/requestsignup', auth, controllers.APIDonorController.requestsignup)
    .post('/v1/user/avatar/upload', auth, controllers.APIDonorController.updateProfilePicture)
    .post('/v1/user/requestsignupconfirmation', auth, controllers.APIDonorController.requestsignupConfirmation)
    .post('/v1/user/requestsignupcomplete', auth, controllers.APIDonorController.requestsignupComplete)
    .post('/v1/user/requestforgotpassword', auth, controllers.APIDonorController.requestResetPassword)
    .post('/v1/user/requestforgotpasswordconfirmation', auth, controllers.APIDonorController.requestResetPasswordConfirmation)
    .post('/v1/user/requestforgotpasswordcomplete', auth, controllers.APIDonorController.requestResetPasswordcomplete)
    .post('/v1/user/me', auth, controllers.APIDonorController.requestProfile)
    .post('/v1/user/requestchangeprofile', auth, controllers.APIDonorController.requestUpdateProfile)
    .post('/v1/user/requestchangepassword', auth, controllers.APIDonorController.requestUpdatePassword)
    .post('/v1/user/transactionreport', auth, controllers.APIReportController.userDonationReport);
  app
    .post('/v1/payment/category', auth, controllers.APIPaymentCategory.index);
  app
    .post('/v1/payment/account', auth, controllers.APIPaymentAccount.index);
  app
    .post('/v1/submerchant', auth, controllers.APIMerchantController.index);
  app
    .post('/v1/categories', auth, controllers.APICategoriesController.index)
    .post('/v1/categories/slug/', auth, controllers.APICategoriesController.findBySlug);
  app
    .post('/v1/video', auth, controllers.APICampaignController.index)
    .post('/v1/video/detail/slug', auth, controllers.APICampaignController.findBySlugg)
    .post('/v1/video/detail/donor', auth, controllers.APICampaignController.campaignDonor)
    .post('/v1/video/detail', auth, controllers.APICampaignController.findById)
    .post('/v1/video/search', auth, controllers.APISearchController.index)
    .post('/v1/video/detail/update', auth, controllers.APICampaignController.campaignUpdate)
    .post('/v1/video/related', auth, controllers.APICampaignController.findRelated);

  app
    .post('/v1/payment/submit/video', auth, controllers.APIPaymentSubmit.campaign)
    .post('/v1/payment/submit/zis', auth, controllers.APIPaymentSubmit.zis)
    .post('/v1/payment/detail', auth, controllers.APIPaymentHistory.detail)
    .post('/v1/payment/history/:name', auth, controllers.APIPaymentHistory.history)
    .post('/v1/payment/history/:name', auth, controllers.APIPaymentHistory.history)
    .post('/v1/payment/uploadproof', auth, controllers.APIPaymentConfirmation.uploadPaymentProof)
    .post('/v1/payment/all/', auth, controllers.APIPaymentHistory.allPaymentStatus);
    /**
     * Donor VM
     */
  app
    .post('/v1/dashboard/report/usercount', auth, controllers.APIReportDashboardController.dashboardUserCount)
    .post('/v1/dashboard/report/payment', auth, controllers.APIReportDashboardController.dahboardTotalPayment)
    .get('/v1/dashboard/report/financialsummary', auth, controllers.APIReportDashboardController.dashboardFinancialReport)
    .get('/v1/dashboard/report/lasttransaction', auth, controllers.APIReportDashboardController.dashboardFinancialReport);
};
