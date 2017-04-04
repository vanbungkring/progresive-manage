const model = require(GLOBAL_PATH + '/models/index');
const output = require(GLOBAL_PATH + '/helper/output.js');
module.exports = {
  findById: findById,
  registerNewDonorFromAdmin: registerNewDonorFromAdmin,
  login: login,
  findByusername: findByusername,
  findByAppToken: findByAppToken,
  registerNewDonor: registerNewDonor,
  getAllDonor: getAllDonor
};

function getAllDonor(parameters, filter, callback) {
  model.donor.find(parameters).sort([
    ['date', 1]
  ]).select(filter).exec(function(err, result) {
    if (err) {
      return callback(output(global.status.STATUS_FAILED_MESSAGE, err, null));
    } else {
      return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
    }
  });
}

function registerNewDonorFromAdmin(parameters, callback) {
  var donorConstruct = new model.donor(parameters);
  donorConstruct.save()
    .then(result => callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result)))
    .catch(err => callback(output(global.status.STATUS_FAILED, global.library.MONGOOSE_ERROR.errorSanitize(err), null)))
}

function registerNewDonor(parameters, callback) {
  new model.donor(parameters).save(function(err, result) {
    if (err) {
      return callback(output(global.status.STATUS_FAILED_MESSAGE, err, null));
    } else {
      return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
    }
  });
}

function login(parameters, callback) {
  findByusername(parameters, function(result) {
    if (result.status === global.status.FAILED) {
      return callback(output(global.status.STATUS_FAILED, result.message, null));
    } else {
      if (!result.data) {
        return callback(output(global.status.STATUS_USER_PASSWORD_NOT_FOUND, global.status.STATUS_USER_PASSWORD_NOT_FOUND_MESSAGE, null));
      } else {
        var models = new model.donor(result.data);
        if (!models.validPassword(parameters.password)) {
          return callback(output(global.status.STATUS_USER_PASSWORD_NOT_FOUND, global.status.STATUS_USER_PASSWORD_NOT_FOUND_MESSAGE, null));
        } else if (result.data.status === 0) {
          return callback(output(global.status.STATUS_USER_NOT_VERIFIED, global.status.STATUS_USER_NOT_VERIFIED_MESSAGE, null));
        } else {
          if (result.data.appToken != undefined) {
            var objectMapping = result.data.toObject();
            delete objectMapping['password'];
            return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, objectMapping));
          } else {
            var token = global.library.JWT.sign({
              username: result.data.username,
              created: new Date()
            }, global.GLOBAL_CONFIG.app.sign_secret);
            result.data.appToken = token;
            result.data.save(function(err, data) {
              if (err) {
                return callback(output(global.status.STATUS_UNKNOWN_ERROR, global.status.STATUS_UNKNOWN_ERROR_MESSAGE, null));
              }
              var objectMapping = data.toObject();
              return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, objectMapping));
            });
          }
        }
      }
    }
  });
}

function findByusername(parameters, callback) {
  var username = parameters.username;
  model.donor.findOne({
    'username': username
  }).select('-provider').exec(function(err, result) {
    if (err) {
      return callback(output(global.status.STATUS_FAILED, err, null));
    } else {
      return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
    }
  });
}

function findByAppToken(parameters, filter, callback) {
  model.donor.findOne({
    'appToken': parameters.appToken
  }).select('-provider -updatedAt -createdAt').select(filter).lean().exec(function(err, result) {
    if (err) {
      return callback(output(global.status.STATUS_FAILED, err, null));
    } else if (result) {
      return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
    } else {
      return callback(output(global.status.STATUS_USER_DOES_NOT_EXIST, global.status.STATUS_USER_DOES_NOT_EXIST_MESSAGE, result));
    }
  });
}

function findById(parameters, callback) {
  model.donor.findOne(parameters).exec(function(err, result) {
    if (err) {
      return callback(output('Error', err, null));
    } else {
      if (err) {
        return callback(output(global.status.STATUS_FAILED, err, null));
      } else {
        return callback(output(global.status.STATUS_SUCCESS, global.status.STATUS_SUCCESS_MESSAGE, result));
      }
    }
  });
}
