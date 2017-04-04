var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}


var newSchema = new Schema({
    'campaign': {
        type: Schema.Types.ObjectId,
        ref: 'campaign',
        required: false
    },
    'paymentCategory': {
        type: Schema.Types.ObjectId,
        ref: 'paymentCategory',
        required: false
    },
    'paymentSource': {
        type: String,
        default: 'ONLINE'
    },
    'paymentMethod': {
        type: String,
        default: 'BANK TRANSFER'
    },
    'paymentType': {
        type: String,
        default: 'program'
    },
    'transactionId': {
        type: Number,
    },
    'userContext': {
        'remarks': {
            type: String,
        },
        'anonymous': {
            type: Boolean,
            default: false
        },
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
        'expireDate': {
            type: Number,
            require:true
        },
        'reminder':{
            type: Number,
            require:true
        },
        'amount': {
            type: Number,
            require: true,
        },
        'totalAmount': {
            type: Number,
            require: true
        },
        'formattedAmountIDR': {
            type: String,
            require: true
        },
        'uniqueCode': {
            type: Number,
            default: 0,
        },
        'bankInfo': {
            type: Schema.Types.ObjectId,
            ref: 'paymentAccount',
            required: false
        },
        'paymentReceive': {
            type: Schema.Types.ObjectId,
            ref: 'paymentReceive',
            required: false,
        },
    },
    'status': {
        'code': {
            type: Number,
            default: 1
        },
        'message': {
            type: String,
            default: 'UNCONFIRMED PAYMENT'
        },
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
newSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});
newSchema.index({
    createdAt: 1
}); // schema level
newSchema.plugin(deepPopulate);
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

newSchema.plugin(global.library.COUNTER, {
    name: 'payment',
    transactionId: 'transactionId'
});
module.exports = mongoose.model('payment', newSchema);
