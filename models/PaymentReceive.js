var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection-string'));
}


var newSchema = new Schema({
    'campaign': {
        type: Schema.Types.ObjectId,
        ref: 'campaign'
    },
    'transactionContext': {
        'payment': {
            type: Schema.Types.ObjectId,
            ref: 'payment',
        },
        'amount': {
            type: Number,
        },
        'platformFee': {
            type: Number,
        },
        'nettAmount': {
            type: Number,
        },
        'formattedAmountIDR': {
            type: String,
        },
        'bankInfo': {
            type: Schema.Types.ObjectId,
            ref: 'paymentAccount',
            required: false
        },
        'paymentReceiveDate': {
            type: Date,
        }
    },
    'operator': {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    'donor': {
        type: Schema.Types.ObjectId,
        ref: 'Donor'
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



module.exports = mongoose.model('paymentReceive', newSchema);
