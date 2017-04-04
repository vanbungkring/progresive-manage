var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}


var paymentTypeSchema = new Schema({
    'name': {
        type: String
    },
    'slug': {
        type: String
    },
    'type': {
        default: 1, ///1 zakat 2 non zakat
        type: Number
    },
    'creator': {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: false
    },
    'bank': [{
        type: Schema.Types.ObjectId,
        ref: 'paymentAccount',
        required: false,
    }],
    'customfield': {
        type: String
    },
    'description': {
        type: String
    },
    'minimum': {
        type: Number,
        default: 20000
    },
    'fee': {
        type: Number
    },
    'status': {
        default: 0,
        type: Number,
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
paymentTypeSchema.plugin(deepPopulate);
paymentTypeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

paymentTypeSchema.pre('update', function() {
    this.update({}, {
        $set: {
            updatedAt: Date.now()
        }
    });
});

paymentTypeSchema.pre('findOneAndUpdate', function() {
    this.update({}, {
        $set: {
            updatedAt: Date.now()
        }
    });
});



module.exports = mongoose.model('paymentCategory', paymentTypeSchema);
