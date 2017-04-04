module.exports = function(status, message, context) {
    return ({
        'status': status,
        'message': message,
        'data': context
    });
};
