const model = require(GLOBAL_PATH + '/models/index');
const donorVM = require(GLOBAL_PATH + '/viewModel/donorVM.js');
var state = 'donor';
var categoriesController = {
  index: function(req, res) {
    donorVM.getAllDonor({}, {}, function(result) {
      res.render('backend/donor/index', {
        layout: 'backend/layout/base',
        title: 'Donatur',
        message: req.flash(state),
        data: result,
        state: state,
      });
    });
  },
  add: function(req, res) {
    if (req.method == 'POST') {
      var construct = {};
      construct.address = {};
      construct.name = req.body.name;
      construct.username = req.body.email;
      construct.phoneNumber = req.body.phoneNumber;
      if (req.body.email && req.body.phoneNumber) {
        construct.provider = 'LOCAL';
      } else {
        construct.provider = 'PN';
      }
      construct.address.address = req.body.address ? req.body.address : '';
      donorVM.registerNewDonorFromAdmin(construct, function(result) {
        //console.log(result);
        var flashName = construct.name;
        var globalStatus = (result.status === global.status.STATUS_FAILED) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
        var msg = (result.status === global.status.STATUS_FAILED) ? 'Gagal menambahkan donatur' : 'Berhasil menambahkan donatur ' + flashName;
        global.library.FLASH(req, state, globalStatus, msg);
        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/donor');
      });
    } else {
      res.render('backend/donor/create', {
        layout: 'backend/layout/base',
        title: 'Tambah Donatur',
        data: {},
        state: state,
      });
    }

  },
  edit: function(req, res) {
    if (req.method == 'GET') {
      donorVM.findById({
        '_id': req.params.id
      }, function(result) {
        res.render('backend/donor/create', {
          layout: 'backend/layout/base',
          title: 'Ubah Donatur',
          data: result,
          state: state,
        });
      });
    } else {
      var construct = {};
      construct.address = {};
      construct.name = req.body.name;
      construct.username = req.body.email;
      construct.phoneNumber = req.body.phoneNumber;
      construct.address.address = req.body.address ? req.body.address : '';
      model.donor.update({
        '_id': req.params.id
      }, construct, {
        upsert: true
      }, function(err) {
        var flashName = construct.name;
        var globalStatus = (err) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
        var msg = (err) ? 'Gagal merubah donatur' : 'Berhasil merubah donatur ' + flashName;
        global.library.FLASH(req, state, globalStatus, msg);
        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/donor');
      });
    }
  },
  delete: function(req, res) {
    if (req.method == 'GET') {
      donorVM.findById({
        '_id': req.params.id
      }, function(result) {
        res.render('backend/donor/delete', {
          layout: 'backend/layout/base',
          title: 'Ubah Donatur',
          data: result,
          state: state,
        });
      });
    } else {
      donorVM.findById({
        '_id': req.params.id
      }, function(result) {
        if (result.data) {
          model.donor.remove({
            _id: req.body._id
          }, function(err) {
            var flashName = result.data.name;
            var globalStatus = (err) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
            var msg = (err) ? 'Gagal menghapus donatur' : 'Berhasil menghapus donatur ' + flashName;
            global.library.FLASH(req, state, globalStatus, msg);
            res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/donor');
          });
        }
      });
    }
  }
};
module.exports = categoriesController;
