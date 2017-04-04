var state = 'operator';
var operatorController = {
    index: function(req, res) {
        res.render('backend/dashboard/index', {
            layout: 'backend/layout/base',
            title: 'Dashboard',
            state: state,
        });
    },
    add: function(req, res) {
        res.render('backend/campaign/create', {
            layout: 'backend/layout/base',
            title: 'Tambah Campaign',
            state: state,
        });
    },
    edit: function(req, res) {

    }
};
module.exports = operatorController;
