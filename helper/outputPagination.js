module.exports = function(status, message, context, perPage, total) {
    return ({
        'count': parseInt(perPage),
        'countTotal': parseInt(total),
        'pages': Math.round(parseInt(total) / parseInt(perPage))?Math.round(parseInt(total) / parseInt(perPage)):1,
        'status': status,
        'message': message,
        'data': context
    });
};
