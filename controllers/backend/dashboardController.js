var state = 'dashboard';
var dashboard = {
  index: function(req, res) {
    res.render('backend/dashboard/index', {
      layout: 'backend/layout/base',
      title: 'Dashboard',
      state: state,
    });
  }
};
module.exports = dashboard;