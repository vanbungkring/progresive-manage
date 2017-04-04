const donorVM = require(GLOBAL_PATH + '/viewModel/donorVM.js');
const output = require(GLOBAL_PATH + '/helper/output.js');
const model = require(GLOBAL_PATH + '/models/index');
var bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

var APIDonorController = {
    updateProfilePicture: function(req, res) {
        if (!req.body.appToken) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_REQUIRED_MESSAGE, null));
        } else if (!req.body.image) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_REQUIRED_IMAGE_MESSAGE, null));
        }
        donorVM.findByAppToken({
            'appToken': req.body.appToken
        }, '', function(result) {
            global.library.CLOUDINARY_UPLOADER.uploadImage(req.body.image, function(uploadResult) {
                if (!uploadResult) {
                    return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_UNKNOWN_ERROR_MESSAGE, null));
                } else {
                    var construct = {};
                    construct = result.data;
                    construct.avatar = uploadResult.url;
                    model.donor.update({
                        '_id': result.data._id
                    }, construct, {
                        upsert: true
                    }, function(err) {
                        if (err) {
                            return res.json(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null));
                        } else {
                            return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_AVATAR_SUCCESS_UPLOADED, construct));
                        }
                    });
                }
            });
        });
    },
    login: function(req, res) {
        donorVM.login(req.body, function(result) {
            res.json(result);
        });
    },
    requestUpdatePassword: function(req, res) {
        if (!req.body.appToken) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_REQUIRED_MESSAGE, null));
        } else if (!req.body.oldPassword) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_USER_OLD_PASSWORD_REQUIRED, null));
        } else if (!req.body.newPassword) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_USER_NEW_PASSWORD_REQUIRED, null));
        } else if (req.body.oldPassword === req.body.newPassword) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_USER_NEW_OLD_PASSWORD_DIFF_REQUIRED, null));
        }
        donorVM.findByAppToken({
            'appToken': req.body.appToken
        }, '', function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                var models = new model.donor(result.data);
                var construct = {};
                construct = result.data;
                if (!models.validPassword(req.body.oldPassword)) {
                    return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_OLD_PASSWORD_IS_NOT_MATCH_MESSAGE, null));
                }
                bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                    if (err)
                        return next(err);
                    bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                        if (err)
                            return next(err);
                        construct.password = hash;
                        model.donor.update({
                            '_id': result.data._id
                        }, construct, {
                            upsert: true
                        }, function(err) {
                            if (err) {
                                return res.json(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null));
                            } else {
                                return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_NEW_PASSWORD_IS_SUCCESS_UPDATED_MESSAGE, null));
                            }
                        });
                    });
                });

            }
        });
    },
    requestUpdateProfile: function(req, res) {
        if (!req.body.username) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_USER_EMAIL_REQUIRED_MESSAGE, null));
        }
        donorVM.findByAppToken(req.body, '-password', function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                var construct = {};
                construct = result.data;
                construct.name = req.body.name
                    ? req.body.name
                    : result.data.username;
                construct.username = req.body.username;
                model.donor.update({
                    '_id': result.data._id
                }, construct, {
                    upsert: true
                }, function(err) {
                    if (err) {
                        return res.json(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null));
                    } else {
                        donorVM.findByAppToken(req.body, '-password', function(afterchangeResult) {
                            return (res.json(afterchangeResult));
                        });
                    }
                });
            }
        });
    },
    requestProfile: function(req, res) {
        if (!req.body.appToken) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_REQUIRED_MESSAGE, null));
        }
        donorVM.findByAppToken(req.body, '-password', function(result) {
            res.json(result);
        });
    },
    requestResetPassword: function(req, res) {
        donorVM.findByusername(req.body, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                if (result.data.status === 1) {
                    return res.json(output(global.status.STATUS_USER_NOT_VERIFIED, global.status.STATUS_USER_NOT_VERIFIED_MESSAGE, null));
                } else {
                    result.data.forgotPasswordToken = global.library.RANDOM;
                    result.data.save(function(err, result) {
                        var outputData = output(global.status.STATUS_TOKEN_ALREADY_SENT, global.status.STATUS_TOKEN_ALREADY_SENT_MESSAGE, result);
                        global.library.MAILLER.sendResetPassswordRequest(req.body.username, outputData);
                        res.json(output(global.status.STATUS_TOKEN_ALREADY_SENT, global.status.STATUS_TOKEN_ALREADY_SENT_MESSAGE, null));
                    });
                }
            } else {
                return res.json(output(global.status.STATUS_USER_DOES_NOT_EXIST, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, null));
            }
        });
    },
    requestResetPasswordConfirmation: function(req, res) {
        donorVM.findByusername(req.body, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                if (result.data.status === 1) {
                    return res.json(output(global.status.STATUS_USER_NOT_VERIFIED, global.status.STATUS_USER_NOT_VERIFIED_MESSAGE, null));
                } else {
                    if (req.body.forgotPasswordToken != result.data.forgotPasswordToken) {
                        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_NOT_MATCH_MESSAGE, null));
                    } else {
                        return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_TOKEN_MATCH_MESSAGE, null));
                    }
                }
            } else {
                return res.json(output(global.status.STATUS_USER_DOES_NOT_EXIST, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, null));
            }
        });
    },
    requestResetPasswordcomplete: function(req, res) {
        donorVM.findByusername(req.body, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                if (result.data.status === 1) {
                    return res.json(output(global.status.STATUS_USER_NOT_VERIFIED, global.status.STATUS_USER_NOT_VERIFIED_MESSAGE, null));
                } else {
                    if (result.data.forgotPasswordToken != req.body.forgotPasswordToken) {
                        res.json(output(global.status.STATUS_TOKEN_NOT_MATCH, global.status.STATUS_TOKEN_NOT_MATCH_MESSAGE, null));
                    } else if (!req.body.password) {
                        res.json(output(global.status.STATUS_USER_PASSWORD_REQUIRED, global.status.STATUS_USER_PASSWORD_REQUIRED_MESSAGE, null));
                    } else {
                        global.library.CACHEGOOSE.clearCache(global.library.CACHE_STATUS.PREFS_CACHE_DONOR_DETAIL + '' + req.body.appToken);
                        result.data.forgotPasswordToken = '';
                        result.data.password = req.body.password;
                        result.data.save(function(err, result) {
                            var constructor = {};
                            constructor.username = result.username;
                            constructor.password = req.body.password;
                            donorVM.login(constructor, function(result) {
                                res.json(result);
                            });
                        });
                    }
                }
            } else {
                return res.json(output(global.status.STATUS_USER_DOES_NOT_EXIST, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, null));
            }
        });
    },
    requestsignupComplete: function(req, res) {
        donorVM.findByusername(req.body, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                if (result.data.status === 1) {
                    if (req.body.activationToken != result.data.activationToken) {
                        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_NOT_MATCH_MESSAGE, null));
                    } else {
                        var models = new model.donor();
                        models = result.data;
                        models.name = req.body.name;
                        models.registerStatus = 2;
                        models.status = 2;
                        models.activationToken = '';
                        models.password = req.body.password;
                        models.save(function(err, result) {
                            if (result) {
                                donorVM.login({
                                    'username': req.body.username,
                                    'password': req.body.password
                                }, function(loginResult) {
                                    res.json(loginResult);
                                });
                            } else {
                                return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_UNKNOWN_ERROR_MESSAGE, null));
                            }
                        });
                        //  return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_TOKEN_MATCH_MESSAGE, null));
                    }

                } else {
                    return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_ALREADY_VERIFIED, null));
                }
            } else {
                return res.json(output(global.status.STATUS_USER_DOES_NOT_EXIST, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, null));
            }
        });
    },
    requestsignupConfirmation: function(req, res) {
        donorVM.findByusername(req.body, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                if (result.data.status === 1) {
                    if (req.body.activationToken != result.data.activationToken) {
                        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_TOKEN_NOT_MATCH_MESSAGE, null));
                    } else {

                        return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_TOKEN_MATCH_MESSAGE, null));
                    }
                } else {
                    return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_ALREADY_VERIFIED, null));
                }
            } else {
                return res.json(output(global.status.STATUS_USER_DOES_NOT_EXIST, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, null));
            }
        });
    },
    requestsignup: function(req, res) {
        if (!req.body.username) {
            return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_USER_EMAIL_REQUIRED_MESSAGE, null));
        }
        donorVM.findByusername(req.body, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else if (result.data) {
                if (result.data.status === 1) {
                    return res.json(output(global.status.STATUS_USER_NOT_VERIFIED, global.status.STATUS_USER_NOT_VERIFIED_MESSAGE, null));
                }
                res.json(output(global.status.STATUS_USER_ALREADY_EXIST, global.status.STATUS_USER_ALREADY_EXIST_MESSAGE, null));
            } else {
                var donorConstructor = {};
                donorConstructor.username = req.body.username;
                donorConstructor.activationToken = global.library.RANDOM;
                donorConstructor.status = 1;
                donorConstructor.provider = req.body.provider;
                donorVM.registerNewDonor(donorConstructor, function(result) {
                    global.library.MAILLER.sendDonorVerificationEmail(req.body.username, result);
                    res.json(output(global.status.STATUS_USER_DOES_NOT_EXIST, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, null));
                });

            }
        });
    },
    logout: function(req, res) {
        donorVM.findById(req.body, function(result) {
            if (result.status === global.status.STATUS_FAILED) {
                return res.json(result);
            } else {
                var models = new model.donor();
                models = result.data;
                models.appToken = '';
                models.save(function(err, result) {
                    if (result) {
                        return res.json(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_LOGOUT_MESSAGE, null));
                    } else {
                        return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_UNKNOWN_ERROR_MESSAGE, null));
                    }

                });

            }
        });
    }
};
module.exports = APIDonorController;
