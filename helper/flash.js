module.exports = function(req, name, status, message) {
  if (status ==='FAILED') {
    status = 'danger';
  }
    req.flash(name, {
        status: status.toLowerCase(),
        message: message
    });
};
