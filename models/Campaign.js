var mongoose = require('mongoose');
var random = require('mongoose-simple-random');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}


var newSchema = new Schema({
    'merchant': {
        type: Schema.Types.ObjectId,
        ref: 'merchant',
        required: false,
    },
    'writer': {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    'campaignUpdate': [{
        type: Schema.Types.ObjectId,
        ref: 'campaignUpdate',
        required: false,
    }],
    'campaignCategory': {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: false,
    },
    'bank': [{
        type: Schema.Types.ObjectId,
        ref: 'paymentAccount',
        required: false,
    }],
    'postMeta': {
        'title': String,
        'slug': String,
        'tag': [{
            type: String
        }],
        'content': String,
        'shortContent': String,
        'videoUrl': String,
        'images': [{
            type: String
        }]
    },
    'paymentReceive': [{
        type: Schema.Types.ObjectId,
        ref: 'paymentReceive',
        required: false,
    }],
    'featured': {
        type: Boolean,
        default: false
    },
    'publishedStatus': {
        type: Number,
        default: 0
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
newSchema.index({
    name: 'text',
    'postMeta.title': 'text',
    'postMeta.slug': 'text'
});
newSchema.plugin(random);
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



module.exports = mongoose.model('campaign', newSchema);
