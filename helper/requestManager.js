var request = require('request');
module.exports = {
  requestAPI: requestAPI
}

function requestAPI(url, method, parameters, headers, callback) {
  request({
      method: method,
      uri: url,
      form: parameters,
      headers: headers
    },
    function(error, response, body) {
      if (error) {
        return console.error('upload failed:', error);
      }
      callback(JSON.parse(body));
    })
}