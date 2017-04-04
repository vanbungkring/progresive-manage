var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}


var newSchema = new Schema({
    /*0 bank,1 pg, 3 others*/
    'type': {
        type: Number,
        default: 0
    },
    'merchant': {
        type: Schema.Types.ObjectId,
        ref: 'merchant',
        require: false
    },
    'paymentCategory': [{
        type: Schema.Types.ObjectId,
        ref: 'paymentCategory',
        require: false
    }],
    'bank': {
        'name': {
            type: String,
        },
        'code': {
            type: String,
        },
        'branchName': {
            type: String,
        },
        'shortName': {
            type: String,
        },
        'holderName': {
            type: String,
        },
        'otherInfo': {
            type: String,
        },
        'accNumber': {
            type: String,
        },
        description: {
            type: String,
        },
    },
    'active': {
        type: Boolean,
        default: true
    },
    'guide': {
        type: String
    },
    'description': {
        type: String
    },
    'otherInformation': {
        type: String
    },
    'createdAt': {
        type: Date,
        default: Date.now
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



module.exports = mongoose.model('paymentAccount', newSchema);
