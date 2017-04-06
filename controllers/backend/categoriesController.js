const categoriesVM = require(GLOBAL_PATH + '/viewModel/categoriesVM.js');
const model = require(GLOBAL_PATH + '/models/index');
var state = 'categories';
var categoriesController = {
    index: function(req, res) {
        categoriesVM.getAllCategories({}, function(result) {
            res.render('backend/categories/index', {
                layout: 'backend/layout/base',
                title: 'Kategori Campaign',
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
            categoriesVM.createCategory(construct, function(result) {
                var globalStatus = (result.status === global.status.STATUS_FAILED)
                    ? global.status.STATUS_FAILED
                    : global.status.STATUS_SUCCESS;
                var msg = (result.status === global.status.STATUS_FAILED)
                    ? 'Gagal menambahkan kategori'
                    : 'Berhasil menambahkan kategori ' + req.body.name;
                global.library.FLASH(req, state, globalStatus, msg);
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/categories');
            });
        } else {
            //  global.library.CACHE_MANAGER.readFromCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_CATEGORY, function(result) {
            global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_CATEGORY + '*');
            res.render('backend/categories/create', {
                layout: 'backend/layout/base',
                title: 'Tambah Kategori Campaign',
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
            model.categories.update({
                '_id': req.params.id
            }, construct, {
                upsert: true
            }, function(err) {
                global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_CATEGORY + '*');
                var globalStatus = err
                    ? global.status.STATUS_FAILED
                    : global.status.STATUS_SUCCESS;
                var msg = err
                    ? 'Gagal merubah kategori'
                    : 'Berhasil merubah kategori ' + req.body.name;
                global.library.FLASH(req, state, globalStatus, msg);
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/categories');
            });
        } else {
            categoriesVM.findCategory({
                '_id': req.params.id
            }, function(result) {
                if (!result.data) {
                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/categories');
                }
                // res.json(result);
                //

                res.render('backend/categories/create', {
                    layout: 'backend/layout/base',
                    title: 'Ubah Kategori Campaign',
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
            categoriesVM.findCategory(constructParams, function(result) {
                if (result.data) {
                    model.categories.remove({
                        _id: req.body._id
                    }, function(err) {
                        var globalStatus = err
                            ? global.status.STATUS_FAILED
                            : global.status.STATUS_SUCCESS;
                        var msg = err
                            ? 'Gagal menghapus kategori' + result.data.name
                            : 'Berhasil menghapus kategori ' + result.data.name;
                        global.library.FLASH(req, state, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/categories');
                    });
                }

            });
        } else {
            categoriesVM.findCategory({
                '_id': req.params.id
            }, function(result) {
                if (!result.data) {
                    res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/categories');
                }
                res.render('backend/categories/delete', {
                    layout: 'backend/layout/base',
                    title: 'Hapus Kategori Campaign',
                    data: result,
                    state: state
                });
            });
        }
    }
};
module.exports = categoriesController;
