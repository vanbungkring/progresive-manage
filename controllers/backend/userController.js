const userVM = require(GLOBAL_PATH + '/viewModel/userVM.js');
var model = require(GLOBAL_PATH + '/models/index');
var state = 'user',
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;
var userController = {
    index: function(req, res) {
        userVM.getAllUser({}, function(result) {
            // res.json(result);
            res.render('backend/user/index', {
                layout: 'backend/layout/base',
                title: 'Pengguna',
                message: req.flash(state),
                data: result,
                state: state,
            });
        });

    },
    add: function(req, res) {
        if (req.method == 'GET') {
            res.render('backend/user/create', {
                layout: 'backend/layout/base',
                title: 'Tambah Pengguna',
                state: state,
                data: {},
                self: false,
            });
        } else {
            var construct = {};
            construct.merchant = req.body.merchant;
            construct.firstName = req.body.firstName;
            construct.lastName = req.body.lastName;
            var token = global.library.JWT.sign({
                username: req.body.email,
                firstName:req.body.firstName,
                lastName:req.body.lastName?req.body.lastName:'',
                created: new Date()
            }, global.GLOBAL_CONFIG.app.sign_secret);

            construct.confirmEmailToken = token;
            construct.email = req.body.email;
            construct.status = 0;
            construct.role = req.body.role;
            userVM.createUser(construct, function(result) {
                if (result.status != global.status.STATUS_FAILED) {
                    var construt = {};
                    construt._id = result.data._id;
                    userVM.findUser(construt, function(result) {
                        global.library.MAILLER.sendUserVerificationEmail(result);
                    });
                }
                var flashName = construct.firstName;
                var globalStatus = (result.status === global.status.STATUS_FAILED) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                var msg = (result.status === global.status.STATUS_FAILED) ? 'Gagal menambahkan pengguna' : 'Berhasil menambahkan pengguna ' + flashName;
                global.library.FLASH(req, state, globalStatus, msg);
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/user');

            });
        }
    },
    edit: function(req, res) {
        var userParameters = req.params.id;
        var self = false;
        if (req.path === '/me/edit/') {
            userParameters = req.user._id;
            self = true;
        }
        if (req.method == 'GET') {
            userVM.findUser({
                '_id': userParameters
            }, function(result) {
                res.render('backend/user/create', {
                    layout: 'backend/layout/base',
                    title: 'Pengguna',
                    data: result,
                    self: self,
                    state: state,
                });
            });
        } else {
            var construct = {};
            construct.merchant = req.body.merchant;
            construct.firstName = req.body.firstName;
            construct.lastName = req.body.lastName;
            construct.email = req.body.email;
            construct.status = 0;
            if (req.body.role) {
                construct.role = req.body.role;
            }
            model.user.update({
                '_id': userParameters
            }, construct, {
                upsert: true
            }, function(err) {
                var flashName = construct.firstName;
                var globalStatus = (err) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                var msg = (err) ? 'Gagal merubah pengguna' : 'Berhasil merubah pengguna ' + flashName;
                global.library.FLASH(req, state, globalStatus, msg);
                if (req.path === '/me/edit/') {
                    // res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/me/edit');
                    var userParameters = req.user._id;
                    var self = true;
                    userVM.findUser({
                        '_id': userParameters
                    }, function(result) {
                        res.render('backend/user/create', {
                            layout: 'backend/layout/base',
                            title: 'Pengguna',
                            message: req.flash(state),
                            data: result,
                            self: self,
                            state: state,
                        });
                    });
                } else {
                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/user');
                }
            });
        }
    },
    delete: function(req, res) {
        var construct = {};
        construct._id = req.params.id;
        if (req.method == 'GET') {
            userVM.findUser(construct, function(result) {
                res.render('backend/user/delete', {
                    layout: 'backend/layout/base',
                    title: 'Hapus Pengguna',
                    state: state,
                    data: result
                });
            });

        } else {
            if (req.user._id === req.body || req.params._id) {
                return res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/user');
            }
            construct._id = req.body;
            userVM.findUser(construct, function(result) {
                if (result.data) {
                    model.user.remove({
                        _id: req.body._id
                    }, function(err) {
                        var flashName = construct.firstName;
                        var globalStatus = (err) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                        var msg = (err) ? 'Gagal menghapus pengguna' : 'Berhasil menghapus pengguna ' + flashName;
                        global.library.FLASH(req, state, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/user');
                    });
                }

            });
        }
    },
    changepassword: function(req, res) {
        var construct = {};
        construct._id = req.user._id;
        if (req.method == 'GET') {
            res.render('backend/user/changePassword', {
                layout: 'backend/layout/base',
                title: 'Ganti Kata Kunci',
                message: req.flash(state),
                state: state,
            });
        } else {
            userVM.findUser(construct, function(result) {
                if (result.data) {
                    var models = new model.user();
                    models = result.data;
                    if (!models.validPassword(req.body.oldPassword)) {
                        var globalStatus = global.status.STATUS_FAILED;
                        var msg = 'Gagal merubah kata sandi';
                        global.library.FLASH(req, state, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/me/changepassword');
                    } else {
                        bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
                            if (err) return next(err);
                            bcrypt.hash(req.body.newPassword, salt, function(err, hash) {
                                if (err) return next(err);
                                construct.password = hash;
                                model.user.update({
                                    '_id': req.user._id
                                }, construct, {
                                    upsert: true
                                }, function(err) {
                                    var globalStatus = (err) ? global.status.STATUS_FAILED : global.status.STATUS_SUCCESS;
                                    var msg = (err) ? 'Gagal merubah kata sandi' : 'Berhasil merubah kata sandi';
                                    global.library.FLASH(req, state, globalStatus, msg);
                                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/me/changepassword');
                                });
                            });
                        });
                    }
                }
            })
        }
        res.redirec
    },
};
module.exports = userController;
