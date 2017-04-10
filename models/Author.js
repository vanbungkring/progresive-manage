var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}

var newSchema = new Schema({
    'name': {
        type: String,
        require: true
    },
    'slug': {
        type: String
    },
    'creator': {
        type: Schema.Types.ObjectId,
        ref: 'user',
        require: false
    },
    'description': {
        type: String
    },
    'status': {
        default: 0,
        type: Number
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

module.exports = mongoose.model('Author', newSchema);
