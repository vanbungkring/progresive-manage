const authorVM = require(GLOBAL_PATH + '/viewModel/authorVM.js');
const model = require(GLOBAL_PATH + '/models/index');
var state = 'author';
var authorController = {
    index: function(req, res) {
        authorVM.getAllAuthor({}, function(result) {
          console.log(result);
            res.render('backend/author/index', {
                layout: 'backend/layout/base',
                title: 'Author',
                message: req.flash(state),
                data: result,
                state: state
            });
        });
    },
    add: function(req, res) {
        if (req.method == 'POST') {
            var construct = {};
            construct.name = req.body.name;
            construct.description = req.body.description;
            construct.creator = req.user._id;
            construct.status = req.body.status
                ? 1
                : 0;
            construct.slug = global.library.SLUGG(req.body.name);
            authorVM.createAuthor(construct, function(result) {
                var globalStatus = (result.status === global.status.STATUS_FAILED)
                    ? global.status.STATUS_FAILED
                    : global.status.STATUS_SUCCESS;
                var msg = (result.status === global.status.STATUS_FAILED)
                    ? 'Gagal menambahkan Author'
                    : 'Berhasil menambahkan Author ' + req.body.name;
                global.library.FLASH(req, state, globalStatus, msg);
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/author');
            });
        } else {
            //  global.library.CACHE_MANAGER.readFromCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_AUTHOR, function(result) {
            global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_AUTHOR + '*');
            res.render('backend/author/create', {
                layout: 'backend/layout/base',
                title: 'Tambah Author Campaign',
                data: {},
                state: state
            });
        }

    },
    edit: function(req, res) {
        if (req.method == 'POST') {
            var construct = {};
            construct.name = req.body.name;
            construct.description = req.body.description;
            construct.creator = req.user._id;
            construct.status = req.body.status
                ? 1
                : 0;
            construct.slug = global.library.SLUGG(req.body.name);
            model.author.update({
                '_id': req.params.id
            }, construct, {
                upsert: true
            }, function(err) {
                global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_AUTHOR + '*');
                var globalStatus = err
                    ? global.status.STATUS_FAILED
                    : global.status.STATUS_SUCCESS;
                var msg = err
                    ? 'Gagal merubah Author'
                    : 'Berhasil merubah Author ' + req.body.name;
                global.library.FLASH(req, state, globalStatus, msg);
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/author');
            });
        } else {
            authorVM.findAuthor({
                '_id': req.params.id
            }, function(result) {
                if (!result.data) {
                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/author');
                }
                // res.json(result);
                //

                res.render('backend/author/create', {
                    layout: 'backend/layout/base',
                    title: 'Ubah Author Campaign',
                    data: result,
                    state: state
                });
            });
        }
    },
    delete: function(req, res) {
        if (req.method == 'POST') {
            var constructParams = {};
            constructParams._id = req.body._id;
            authorVM.findAuthor(constructParams, function(result) {
                if (result.data) {
                    model.author.remove({
                        _id: req.body._id
                    }, function(err) {
                        var globalStatus = err
                            ? global.status.STATUS_FAILED
                            : global.status.STATUS_SUCCESS;
                        var msg = err
                            ? 'Gagal menghapus Author' + result.data.name
                            : 'Berhasil menghapus Author ' + result.data.name;
                        global.library.FLASH(req, state, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/author');
                    });
                }

            });
        } else {
            authorVM.findAuthor({
                '_id': req.params.id
            }, function(result) {
                if (!result.data) {
                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/author');
                }
                res.render('backend/author/delete', {
                    layout: 'backend/layout/base',
                    title: 'Hapus Author Campaign',
                    data: result,
                    state: state
                });
            });
        }
    }
};
module.exports = authorController;
