const model = require(GLOBAL_PATH + '/models/index');
module.exports = {
    getCampaignById: getMerchantById,
    createNewCampaign: createNewCampaign,
    updateCampaign: updateCampaign,
    deleteCampaign: deleteCampaign
};

function updateCampaign(parameters, callback) {
    getCampaignById(parameters._id, function(result) {
        var models = new model.campaign();
        if (!result) {
            callback({});
        } else {
            models = result;
            models.name = parameters.name;
            models.slug = slug(parameters.name);
            models.contact.phoneNumber = parameters.phoneNumber;
            models.contact.email = parameters.email;
            models.contact.website = parameters.website;
            models.address.address = parameters.address;
            models.contactPerson.firstName = parameters.contactFirstname;
            models.contactPerson.lastName = parameters.contactLastname;
            models.contactPerson.phoneNumber = parameters.contactPhoneNumber;
            models.contactPerson.email = parameters.contactEmail;
            models.status = parameters.status;
            models.discount = parameters.discount;
            models.address.address = parameters.address;
            models.save(function(err, result) {
                if (err) {
                    callback({});
                } else {
                    callback(result);
                }
            });
        }
    });
}

function getCampaignById(parameters, callback) {
    model.campaign.find({
        '_id': parameters
    }).exec(function(err, result) {
        var object = {};
        if (err) {
            callback({});
        } else {
            callback(result.length > 0 ? result[0] : {});
        }
    })
}
