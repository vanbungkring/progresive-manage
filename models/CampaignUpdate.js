var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var reconnect = require('mongoose-reconnect');
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}


var newSchema = new Schema({
    'campaign': {
        type: Schema.Types.ObjectId,
        ref: 'campaign',
        required: true,
    },
    'writer': {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    'postMeta': {
        'title': String,
        'content': String,
        'videoUrl': String,
        'images': [{
            type: String
        }]
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



module.exports = mongoose.model('campaignUpdate', newSchema);
