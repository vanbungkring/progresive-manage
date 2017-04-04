var mongoose = require('mongoose');
var Schema = mongoose.Schema;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var beautifyUnique = require('mongoose-beautiful-unique-validation');
var newSchema = new Schema({
    'name': {
        type: String,
        require: true,
        unique: global.status.STATUS_USER_EMAIL_ALREADY_EXIST,
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
newSchema.plugin(beautifyUnique);
newSchema.index({
    name: 'text',
    'slug': 'text'
});
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



module.exports = mongoose.model('categories', newSchema);
