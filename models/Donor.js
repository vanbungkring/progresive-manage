var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    uniqueValidator = global.library.UNIQUE_VALIDATOR,
    Schema = mongoose.Schema,
    SALT_WORK_FACTOR = 10,
    MAX_LOGIN_ATTEMPTS = 5,
    MAX_VERIFICATION_ATTEMPTS = 5;
LOCK_TIME = 2 * 60 * 60 * 1000;
if (mongoose.connection.readyState === 0) {
    mongoose.connect(require('./connection'));
}
/*
user activation Status:
0:not activated,
1:alrady sent verification
2: user alrady activated
*/
/**
 * registerStatus
 * 1 partially register
 * 2 Complete Register
 *
 */
var newSchema = new Schema({
    'username': {
        type: String,
        unique: true,
        sparse: true,
        lowercase: true
    },
    'gender': {
        type: Number,
    },
    'title': {
        type: String
    },
    'dob': {
        type: Date
    },
    'phoneNumber': {
        type: String
    },
    'name': {
        type: String
    },
    'avatar': {
        type: String
    },
    'provider': {
        type: String,
        default: 'LOCAL'
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
    'forgotPasswordToken': {
        type: String
    },
    'transactionToken': {
        type: String
    },
    'activationToken': {
        type: String
    },
    'address': {
        'streetAddress': {
            type: String
        },
        'address': {
            type: String
        },
        'city': {
            type: String
        },
        'state': {
            type: String
        },
        'zip': {
            type: Number
        },
        'geoLocation': {
            'latitude': {
                type: Number
            },
            'longitude': {
                type: Number
            },
        },
    },
    // new properties
    'loginAttempts': {
        type: Number,
        required: true,
        default: 0
    },
    'lockUntil': {
        type: Number
    },
    'status': {
        type: Number,
        default: 0
    },
    'resetPassworExpires': {
        type: Date
    },
    'registerStatus': {
        type: Number,
        default: 1
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
newSchema.plugin(uniqueValidator, {
    message: '{PATH} already exists!'
});

newSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

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

module.exports = mongoose.model('donor', newSchema);
