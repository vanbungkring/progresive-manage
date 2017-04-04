var mongooseHelper = {
    errorSanitize: function(parameters) {
        var error = [];
        for (field in parameters.errors) {
            error.push(parameters.errors[field].message);
        }
        return error;
    }
};
module.exports = mongooseHelper;
