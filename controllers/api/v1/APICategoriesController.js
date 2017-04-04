const categoriesVM = require(GLOBAL_PATH + '/viewModel/categoriesVM.js');
var categoriesController = {
  index: function(req, res) {
    global.library.CACHE_MANAGER.readFromCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_CATEGORY, function(result) {
      if (result != null) {
        return res.json(result);
      }
      categoriesVM.getAllCategories({}, function(result) {
        if (result.data) {
          global.library.CACHE_MANAGER.storeCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_CATEGORY, result, {});
        }
        return res.json(result);
      });
    });
  },
  findBySlug: function(req, res) {
    if (req.body.slug == undefined) {
      return res.json(output(global.status.STATUS_FAILED, global.status.STATUS_CATEGORIES_SLUG_REQUIRED, null));
    } else {
      global.library.CACHE_MANAGER.readFromCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_CATEGORY + '_SLUG_' + req.body.slug, function(result) {
        if (result != null) {
          return res.json(result);
        }
        var construct = {};
        construct.slug = req.body.slug;
        categoriesVM.findCategory(construct, function(result) {
          if (result.data) {
            global.library.CACHE_MANAGER.storeCache(global.library.CACHE_STATUS.PREFS_CACHE_CAMPAIGN_CATEGORY + '_SLUG_' + req.body.slug, result, {});
          }
          return res.json(result);
        });
      });
    }
  }
};
module.exports = categoriesController;
