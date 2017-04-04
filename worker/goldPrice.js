const model = require(GLOBAL_PATH + '/models/index');
module.exports = {
  updateGoldPrice: updateGoldPrice,
};

function updateGoldPrice() {
  ///(url, method, parameters,headers, callback)
  global.library.APIMANAGER.requestAPI('http://data-asg.goldprice.org/GetData/IDR-XAU/1', 'GET', {}, {}, function(resultGold) {
    var goldPrice = resultGold[0].substr(resultGold[0].indexOf(",") + 1);
    var golPricePerGram = Math.ceil(parseInt(goldPrice) / 28.3495);

    model.zakatconfig.findOne().exec(function(err, result) {
      if (!result) {
        var goldPriceModel = new model.zakatconfig();
        goldPriceModel.goldPrice = golPricePerGram;
        goldPriceModel.goldPriceRaw = goldPrice
        goldPriceModel.save(function(err, result2) {
        });
      } else {
        model.zakatconfig.update({
          '_id': result._id
        }, {
          'goldPrice': golPricePerGram,
          'goldPriceRaw': goldPrice
        }, {
          upsert: true
        }, function(err) {
          if (err) {
        console.log('inset->', result2);
          }
        })
      }
    })
  })
}
