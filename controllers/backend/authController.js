var auth = {
  login: function(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign');
    }
    res.render('backend/auth/index', {
      layout: 'backend/layout/authLayout',
    });
  },
  logout: function(req, res) {
    req.logout();
    res.redirect('/');
  },
  confirmation: function(req, res) {
    res.render('backend/confirmation/userConfirmation', {
      layout: 'backend/layout/authLayout',
    });
  },
  restricted: function(req, res) {
    var alert = {};
    alert.title = 'Error';
    alert.message = 'Restricted Area';
    res.render('backend/alert/index', {
      layout: 'backend/layout/base',
      title: 'Restricted Area',
      data: alert,
    });
  }
};
module.exports = auth;
