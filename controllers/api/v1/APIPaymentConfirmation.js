const output = require(GLOBAL_PATH + '/helper/output.js');
var models = require(GLOBAL_PATH + '/models/index');
const paymentConfirmationVM = require(GLOBAL_PATH + '/viewModel/paymentConfirmationVM.js');
const donorVM = require(GLOBAL_PATH + '/viewModel/donorVM.js');
const paymentVM = require(GLOBAL_PATH + '/viewModel/paymentVM.js');
var APIPaymentConfirmationController = {
  uploadPaymentProof: function(req, res) {
    console.log(req.body);

      if (!req.body.transactionId) {
        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_PARAMETERS_TRANSACTION_ID_REQUIRED_MESSAGE, null));
      } else if (!req.body.image) {
        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_REQUIRED_IMAGE_MESSAGE, null));
      } else if (!req.body.appToken) {
        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_REQUIRED_MESSAGE, null));
      }
      var construct = {};
      //'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo'
      construct.queryParameters = {};
      construct.queryParameters._id = req.body.transactionId;
      paymentVM.findPayment(construct, function(paymentResult) {
        if (paymentResult.status === global.status.STATUS_FAILED) {
          return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TRANSACTION_DOES_NOT_EXIST_MESSAGE, null));
        }
        /* handle if there is no match token*/
        donorVM.findByAppToken(req.body, '', function(donorResult) {
          if (donorResult.status === global.status.STATUS_SUCCESS) {
            global.library.CLOUDINARY_UPLOADER.uploadImage(req.body.image, function(uploadResult) {
              console.log(uploadResult);
              var construct = {};
              construct.transactionContext = {};
              construct.userContext = {};
              construct.transactionContext.payment = req.body.transactionId;
              construct.userContext.appToken = req.body.appToken;
              construct.paymentProof = uploadResult;
              construct.userContext.donor = donorResult.data._id;
              paymentConfirmationVM.createPaymentConfirmation(construct, function(paymentConfirmationResult) {
                var paymentUpdateConstruct = paymentResult.data;
                paymentUpdateConstruct.status.message = global.status.STATUS_PAYMENT_STATUS_PROOF_RECEIVED;
                paymentUpdateConstruct.updatedAt = new Date();
                models.payment.update({
                  '_id': paymentUpdateConstruct._id
                }, paymentUpdateConstruct, {
                  upsert: true
                }, function(err) {
                  if (!err) {
                    var construct2 = {};
                    construct2.queryParameters = {};
                    construct2.queryParameters._id = req.body.transactionId;
                    paymentVM.findPayment(construct2, function(paymentResult2) {
                      var cacheKey = global.library.CACHE_STATUS.PREFS_CACHE_HISTORY;
                      cacheKey+='_TOKEN_'+req.body.appToken+ '*';
                      global.library.CACHE_MANAGER.deleteCache(cacheKey);
                      return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_PAYMENT_STATUS_PROOF_RECEIVED, null));
                    });
                  }

                });
              });
            });
          }
        })



      });
    }
    //   uploadPaymentProof: function(req, res) {
    //
    //   //   if (!req.body.transactionId) {
    //   //     return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_PARAMETERS_TRANSACTION_ID_REQUIRED_MESSAGE, null));
    //   //   } else if (!req.body.image) {
    //   //     return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_REQUIRED_IMAGE_MESSAGE, null));
    //   //   }
    //   //   if (!req.body.appToken) {
    //   //     if (!req.body.email) {
    //   //       return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_USER_EMAIL_REQUIRED_MESSAGE, null));
    //   //     } else if (!req.body.deviceId) {
    //   //       return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_DEVICE_ID_REQUIRED_MESSAGE, null));
    //   //     }
    //   //     var constructor = {};
    //   //     constructor.userContext = {};
    //   //     constructor.transactionContext = {};
    //   //     constructor.paymentProof = {};
    //   //     donorVM.findByusername({
    //   //       'username': req.body.email
    //   //     }, function(result) {
    //   //       if (result.data == undefined) {
    //   //         return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, null));
    //   //       } else {
    //   //         var contextUser = {};
    //   //         var transactionContext = {};
    //   //         contextUser.appToken = result.data.appToken;
    //   //         contextUser.donor = result.data._id;
    //   //         contextUser.deviceId = req.body.deviceId;
    //   //         contextUser.username = req.body.email;
    //   //         constructor.userContext = contextUser;
    //   //         paymentVM.findPayment({
    //   //           '_id': req.body.transactionId
    //   //         }, function(paymentResult) {
    //   //           if (result.data == undefined) {
    //   //             return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TRANSACTION_DOES_NOT_EXIST_MESSAGE, null));
    //   //           }
    //   //           transactionContext.payment = req.body.transactionId;
    //   //           constructor.transactionContext = transactionContext;
    //   //           global.library.CLOUDINARY_UPLOADER.uploadImage(req.body.image, function(result) {
    //   //             if (!result) {
    //   //               return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_FAILED, null));
    //   //             }
    //   //             constructor.paymentProof = result;
    //   //             paymentConfirmationVM.createPaymentConfirmation(constructor, function(result) {
    //   //               var updatedPaymentModels = new models.payment();
    //   //               updatedPaymentModels = paymentResult.data;
    //   //               updatedPaymentModels.status.message = global.status.STATUS_PAYMENT_STATUS_PROOF_RECEIVED;
    //   //               updatedPaymentModels.save();
    //   //               res.json(result);
    //   //             });
    //   //           });
    //   //         });
    //   //       }
    //   //     });
    //   //   } else {
    //   //     global.library.CLOUDINARY_UPLOADER.uploadImage(req.body.image, function(result) {
    //   //       res.json(result);
    //   //     });
    //   //   }
    //   // }
};
module.exports = APIPaymentConfirmationController;
