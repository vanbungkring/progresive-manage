var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}


var newSchema = new Schema({
    'userContext': {
        'appToken': {
            type: String,
        },
        'deviceId': {
            type: String,
        },
        'donor': {
            type: Schema.Types.ObjectId,
            ref: 'donor',
        },
        'email': {
            type: String,
        },
    },
    'transactionContext': {
        'payment': {
            type: Schema.Types.ObjectId,
            ref: 'payment',
        }
    },
    'paymentProof': {
        type: Schema.Types.Mixed
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



module.exports = mongoose.model('paymentConfirmation', newSchema);