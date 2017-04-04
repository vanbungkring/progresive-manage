const paymentVM = require(GLOBAL_PATH + '/viewModel/paymentVM');
const model = require(GLOBAL_PATH + '/models/index');
module.exports = {
    updatePaymentStatus: updatePaymentStatus,
};

function updatePaymentStatus(jobName, startDate, endDate) {
    var populate = [{
        path: 'campaign',
        model: 'campaign',
        select: '-postMeta.content -postMeta.image',
        populate: {
            path: 'bank',
            model: 'paymentAccount'
        }
    }, {
        path: 'userContext.user'
    }];
    var construct = {};
    var perPage = 100000,
        page = 0;
    construct.queryParameters = {};
    construct.queryParameters['status.code'] = 1;
    construct.queryParameters['status.message'] = {
        $ne: global.status.STATUS_PAYMENT_STATUS_EXPIRED
    };
    if (jobName === global.status.AGENDA_JOB_CHECK_PAYMENT_EXPIRED) {
        construct.queryParameters['transactionContext.expireDate'] = {
            $gte: startDate,
            $lt: endDate
        };
    } else if (jobName === global.status.AGENDA_JOB_CHECK_PAYMENT_NEED_FIRST_REMINDER) {
        construct.queryParameters['transactionContext.reminder'] = {
            $gte: startDate,
            $lt: endDate
        };
    }
    construct.perPage = perPage;
    construct.page = page;
    construct.populate = populate;
    construct.deepPopulate = 'paymentCategory.bank transactionContext.bankInfo transactionContext.paymentReceive.transactionContext.bankInfo';
    construct.filter = '';
    paymentVM.getAllPayment(construct, '', function(result) {
        var buffer = [];
        if (result.data.length > 0) {
            for (var i = 0; i < result.data.length; i++) {
                buffer.push(result.data[i]._id);
            }
            if (jobName === global.status.AGENDA_JOB_CHECK_PAYMENT_EXPIRED) {
                updatePaymentStatus(buffer);
            } else {
                sendReminderEmail(buffer);
            }

        }
    });
}

function sendReminderEmail(buffer) {
    console.log(buffer);
}

function updatePaymentStatus(transactionId) {
    for (var i = 0; i < transactionId.length; i++) {
        model.payment.update({
            '_id': transactionId[i]
        }, {
            $set: {
                'status.message': global.status.STATUS_PAYMENT_STATUS_EXPIRED
            }
        }, {
            upsert: true
        }, function(err) {
            if (!err) {}
        });
    }

}
