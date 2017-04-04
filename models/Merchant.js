var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}

var newSchema = new Schema({
    'name': {
        type: String
    },
    'slug': {
        type: String
    },
    'contactPerson': {
        'firstName': {
            type: String
        },
        'lastName': {
            type: String
        },
        'phoneNumber': {
            type: String
        },
        'email': {
            type: String
        }
    },
    'contact': {
        'website': {
            type: String
        },
        'email': {
            type: String
        },
        'phoneNumber': {
            type: String
        }
    },
    'address': {
        'streetAddress': {
            type: String
        },
        'address': {
            type: String
        },
        'city': {
            type: String
        },
        'state': {
            type: String
        },
        'zip': {
            type: Number
        },
        'geoLocation': {
            'latitude': {
                type: Number
            },
            'longitude': {
                type: Number
            },
        },
    },
    'logo': {
        type: String
    },
    'taxId': {
        type: String
    },
    'description': {
        type: String
    },
    'type': {
        default: 1,
        type: Number,
    },
    'status': {
        default: 0,
        type: Number,
    },
    'payment': [{
        type: Schema.Types.ObjectId,
        ref: 'paymentType',
    }],
    'createdAt': {
        type: Date,
        default: Date.now
    },
    'discount': {
        default: 0,
        type: Number,
    },
    'updatedAt': {
        type: Date,
        default: Date.now
    }
});
var deepPopulate = require('mongoose-deep-populate')(mongoose);
newSchema.plugin(deepPopulate);
newSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

newSchema.pre('update', function() {
    this.update({}, {
        $set: {
            updatedAt: Date.now()
        }
    });
});

newSchema.pre('findOneAndUpdate', function() {
    this.update({}, {
        $set: {
            updatedAt: Date.now()
        }
    });
});

module.exports = mongoose.model('merchant', newSchema);