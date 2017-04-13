const campaignVM = require(GLOBAL_PATH + '/viewModel/campaignVM.js');
const model = require(GLOBAL_PATH + '/models/index');
var state = 'campaign';
var campaignController = {
    index: function(req, res) {
        var construct = {};
        var perPage = 1000,
            page = req.body.page > 0
                ? req.body.page
                : 0;
        construct.queryParameters = {};
        construct.perPage = perPage;
        construct.page = page;
        construct.deepPopulate = 'writer campaignCategory author';
        construct.filter = '-postMeta.content';
        campaignVM.getAllCampaign(construct, '', function(result) {
            res.render('backend/campaign/index', {
                layout: 'backend/layout/base',
                title: 'Campaign',
                message: req.flash(state),
                data: result,
                state: state
            });
        });

    },
    add: function(req, res) {
        if (req.method === 'POST') {
            var construct = {};
            construct.postMeta = {};
            var post = {};
            construct.fundRaisingTarget = req.body.campaignFundTarget;
            //construct.merchant = req.body.merchant ? req.body.merchant : req.user.merchant._id;
            construct.campaignCategory = req.body.campaignCategory;
            construct.author = req.body.author;
            post.videoUrl = req.body.videoUrl;
            construct.bank = req.body.bank;
            construct.writer = req.user._id
                ? req.user._id
                : 0;
            construct.publishedStatus = req.body.publishedStatus
                ? 1
                : 0;
            construct.featured = req.body.featured
                ? true
                : false;
            post.title = req.body.title;
            post.images = req.body.images;
            post.slug = global.library.SLUGG(req.body.title);
            post.tag = req.body.tags
                ? req.body.tags.split(',')
                : [];
            post.content = req.body.content;
            construct.postMeta = post;
            campaignVM.createCampaign(construct, function(result) {
                global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN + '*');
                var globalStatus = (result.status === global.status.STATUS_FAILED)
                    ? global.status.STATUS_FAILED
                    : global.status.STATUS_SUCCESS;
                var msg = (result.status === global.status.STATUS_FAILED)
                    ? 'Gagal menambahkan campaign'
                    : 'Berhasil menambahkan campaign ' + post.title;
                global.library.FLASH(req, state, globalStatus, msg);
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign');
            });
        } else {
            // var minDate = '12/2/2017';
            var temp = global.library.MOMENT().add(20, 'days');
            var minDate = global.library.MOMENT(temp).format('DD/MM/YYYY');
            res.render('backend/campaign/create', {
                layout: 'backend/layout/base',
                title: 'Tambah konten',
                data: {},
                state: state,
                minDate: minDate
            });

        }
    },
    edit: function(req, res) {
        var constructParams = {};
        constructParams.queryParameters = {};
        constructParams.queryParameters._id = req.params.id;
        //console.log(global.library.MOMENT);
        if (req.method === 'GET') {
            campaignVM.findCampaign(constructParams, function(result) {
                // res.json(result);
                res.render('backend/campaign/create', {
                    layout: 'backend/layout/base',
                    title: 'Ubah konten',
                    data: result,
                    moment: global.library.MOMENT,
                    state: state,
                    minDate: null
                });
            });
        } else {
            var construct = {};
            var post = {};
            var date = new Date(global.library.MOMENT(req.body.campaignDateTarget, 'DD/MM/YYYY').format('DD/MM/YYYY 00:00:00')).toISOString();
            construct.endDate = date;
            construct.fundRaisingTarget = req.body.campaignFundTarget;
            //construct.merchant = req.body.merchant ? req.body.merchant : req.user.merchant._id;
            construct.campaignCategory = req.body.campaignCategory;
            construct.author = req.body.author;
            post.videoUrl = req.body.videoUrl;
            construct.bank = req.body.bank
                ? req.body.bank
                : [];
            construct.writer = req.user._id;
            construct.publishedStatus = req.body.publishedStatus
                ? 1
                : 0;
            construct.featured = req.body.featured
                ? true
                : false;
            post.title = req.body.title;
            post.slug = global.library.SLUGG(req.body.title);
            // var images = [];
            // if (req.body.images) {
            //     images.push(req.body.images);
            // }
            post.images = req.body.images;
            post.tag = req.body.tags
                ? req.body.tags.split(',')
                : [];
            post.content = req.body.content;
            construct.postMeta = post;
            model.campaign.update({
                '_id': req.params.id
            }, construct, {
                upsert: true
            }, function(err) {
                if (!err) {
                    global.library.CACHE_MANAGER.deleteCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN + "*");
                }
                var globalStatus = err
                    ? global.status.STATUS_FAILED
                    : global.status.STATUS_SUCCESS;
                var msg = err
                    ? 'Gagal merubah konten'
                    : 'Berhasil merubah konten ' + post.title;
                global.library.FLASH(req, state, globalStatus, msg);
                res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign');
            });
        }
    },
    delete: function(req, res) {
        var constructParams = {};
        if (req.method === 'GET') {
            constructParams.queryParameters = {};
            constructParams.queryParameters._id = req.params.id;
            //console.log(global.library.MOMENT);
            campaignVM.findCampaign(constructParams, function(result) {
                res.render('backend/campaign/delete', {
                    layout: 'backend/layout/base',
                    title: 'Konfirmasi Hapus konten',
                    data: result,
                    moment: global.library.MOMENT,
                    state: state
                });
            });
        } else {
            // var constructParams = {};
            constructParams.queryParameters = {};
            constructParams.queryParameters._id = req.body._id;
            campaignVM.findCampaign(constructParams, function(result) {
                if (result.data) {
                    model.campaign.remove({
                        _id: req.body._id
                    }, function(err) {
                        var globalStatus = err
                            ? global.status.STATUS_FAILED
                            : global.status.STATUS_SUCCESS;
                        var msg = err
                            ? 'Gagal menghapus campaign' + result.data.postMeta.title
                            : 'Berhasil menghapus campaign ' + result.data.postMeta.title;
                        global.library.FLASH(req, state, globalStatus, msg);
                        res.redirect(PREFIX_ROUTE_BACK_OFFICE + '/campaign');
                    });
                }

            });
        }
    }
};
module.exports = campaignController;
