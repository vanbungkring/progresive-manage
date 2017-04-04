module.exports = function(code, status, message, context, res) {
    res.send({
        'status': status,
        'message': message,
        'data': context
    }, {
        'Content-Type': 'application/json'
    }, 200);
};
