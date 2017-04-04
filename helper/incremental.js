var mongoose = require('mongoose');
var Schema = mongoose.Schema;
module.exports = function(schema, options) {
    var options = options || {};
    options.name = options.name || 'generic';
    options.field = options.field || 'transactionId';

    var counterSchema = new Schema({
        name: String,
        counter: Number
    });
    var CounterModel = mongoose.model('counters', counterSchema);

    schema.pre('save', function(next) {
        if (!this.isNew) {
            return next();
        }

        var self = this;

        CounterModel.findOneAndUpdate({
            name: options.name
        }, {
            $inc: {
                counter: 1
            }
        }, {
            upsert: true
        }, function(err, counter) {
            if (err) {
                return next(err);
            }

            self.set(options.field, counter.counter);

            next();
        });
    });
};