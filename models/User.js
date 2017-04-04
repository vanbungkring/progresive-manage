var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 10;
var mongodbErrorHandler = require('mongoose-mongodb-errors');
let beautifyUnique = require('mongoose-beautiful-unique-validation');
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}

var newSchema = new Schema({
    'merchant': {
        type: Schema.Types.ObjectId,
        ref: 'merchant',
        required: false
    },
    'email': {
        type: String,
        lowercase: true,
        index: true,
        unique: global.status.STATUS_USER_EMAIL_ALREADY_EXIST
    },
    'gender': {
        type: Number,
    },
    'activationToken': {
        type: String
    },
    'status': {
        type: Number,
        default: 0
    },
    'phoneNumber': {
        type: String
    },
    'firstName': {
        type: String,
        required: true
    },
    'lastName': {
        type: String,
        required: true
    },
    'photoProfile': {
        type: String
    },
    'provider': {
        type: String,
        default: 'local'
    },
    'password': {
        type: String
    },
    'salt': {
        type: String
    },
    'appToken': {
        type: String
    },
    'resetPasswordToken': {
        type: String
    },
    'confirmEmailToken': {
        type: String
    },
    'transction_token': {
        type: String
    },
    'resetPassworExpires': {
        type: Date
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
newSchema.plugin(beautifyUnique);
newSchema.plugin(deepPopulate);
newSchema.plugin(require('mongoose-role'), {
roles: ['superadmin', 'cs', 'admin','operator'],
  accessLevels: {
    'private': ['superadmin', 'cs', 'admin','operator'],
     'admin': ['admin','superadmin']
  }
});

//newSchema.plugin(uniqueValidator);
newSchema.pre('save', function(next) {
    var user = this;
    // get the current date
    var currentDate = new Date();

    // change the updatedAt field to current date
    user.updatedAt = currentDate;

    // if createdAt doesn't exist, add to that field
    if (!user.createdAt)
        user.createdAt = currentDate;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

newSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(SALT_WORK_FACTOR), null);
};

// checking if password is valid
newSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

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

module.exports = mongoose.model('user', newSchema);
