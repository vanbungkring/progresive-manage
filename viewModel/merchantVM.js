const model = require(GLOBAL_PATH + '/models/index');
var slug = require('slugg');
module.exports = {
    getMerchantById: getMerchantById,
    getAllSubmerchant: getAllSubmerchant,
    getSubmerchantBySlug: getSubmerchantBySlug,
    createNewMerchant: createNewMerchant,
    getParentMerchant: getParentMerchant,
    updateMerchant: updateMerchant
};

function updateMerchant(parameters, callback) {
    getMerchantById(parameters._id, function(result) {
        var models = new model.merchant();
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
            models.status = parameters.status ? true : false;
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

function createNewMerchant(parameters, callback) {
    var models = new model.merchant();
    models.name = parameters.name;
    models.slug = slug(parameters.name);
    models.contact.phoneNumber = parameters.phoneNumber;
    models.contact.email = parameters.email;
    models.contact.website = parameters.website;
    models.address.address = parameters.address;
    models.type = parameters.type ? parameters.type : 1;
    models.contactPerson.firstName = parameters.contactFirstname;
    models.contactPerson.lastName = parameters.contactLastname;
    models.contactPerson.phoneNumber = parameters.contactPhoneNumber;
    models.contactPerson.email = parameters.contactEmail;
    models.status = parameters.status ? true : false;
    models.discount = parameters.discount;
    models.address.address = parameters.address;
    models.save(function(err, result) {
        if (err) {
            console.log(err);
            callback({});
        } else {
            callback(result);
        }
    });

}

function getSubmerchantBySlug(parameters, result) {
    model.merchant.find({
        'slug': parameters
    }).exec(function(err, result) {
        if (err) {
            callback({});
        } else {
            callback(result.length > 0 ? result[0] : {});
        }
    });
}

function getParentMerchant(callback) {
    model.merchant.find({
        'type': 1
    }).exec(function(err, result) {
        if (err) {
            callback({});
        } else {
            callback(result.length > 0 ? result[0] : {});
        }
    });
}

function getAllSubmerchant(parameters, callback) {
    model.merchant.find(parameters).sort([
        ['date', -1]
    ]).exec(function(err, result) {
        if (err) {
            callback([]);
        } else {
            callback(result);
        }
    });
}

function getMerchantById(parameters, callback) {
    model.merchant.find({
        '_id': parameters
    }).exec(function(err, result) {
        if (err) {
            callback({});
        } else {
            callback(result.length > 0 ? result[0] : {});
        }
    });
}
