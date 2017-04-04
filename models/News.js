var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}


var newSchema = new Schema({
    'merchant': {
        type: Schema.Types.ObjectId,
        ref: 'merchant',
        required: true,
    },
    'writer': {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    'postType': Number,
    'postMeta': {
        'title': String,
        'slug': String,
        'tag': [{
            type: String
        }],
        'content': String,
        'videoUrl': String,
        'images': [{
            type: String
        }]
    },
    'publishedStatus': String,
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



module.exports = mongoose.model('news', newSchema);
