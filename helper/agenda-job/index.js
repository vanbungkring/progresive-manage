const PREFS_AGENDA_JOB_PAYMENT_STATUS_MAILLER_UPDATER = 'PREFS_AGENDA_JOB_PAYMENT_STATUS_MAILLER_UPDATER';
const WORKER = require(GLOBAL_PATH + '/worker/');


function init() {
    registerAgendaJob();
    global.library.AGENDA_MANAGER.on('ready', function() {
        removeStaleJobs((e, r) => {
            if (e) {
                console.error("Unable to remove stale jobs. Starting anyways.");
            }
            global.library.AGENDA_MANAGER.every('1 minutes', global.status.PREFS_AGENDA_JOB_GOLD_PRICE_UPDATER)
            global.library.AGENDA_MANAGER.every('1 minutes', global.status.PREFS_AGENDA_JOB_PAYMENT_STATUS_MAILLER_UPDATER);
            global.library.AGENDA_MANAGER.start();
        });

    });
}

function removeStaleJobs(callback) {
    global.library.AGENDA_MANAGER._collection.update({
        lockedAt: {
            $exists: true
        }
    }, {
        $set: {
            lockedAt: null
        }
    }, {
        multi: true
    }, callback);
}

function registerAgendaJob() {
    global.library.AGENDA_MANAGER.define(global.status.PREFS_AGENDA_JOB_PAYMENT_STATUS_MAILLER_UPDATER, function(job, done) {
        var dateSource = new Date();
        var endDate = global.library.MOMENT(new Date(dateSource.getTime() + (1 * 60 * 1000))).unix();
        var startDate = global.library.MOMENT(dateSource).unix();
        WORKER.paymentWorker.updatePaymentStatus(global.status.AGENDA_JOB_CHECK_PAYMENT_EXPIRED, startDate, endDate);
        WORKER.paymentWorker.updatePaymentStatus(global.status.AGENDA_JOB_CHECK_PAYMENT_NEED_FIRST_REMINDER, startDate, endDate);
        done();
    });
  global.library.AGENDA_MANAGER.define(global.status.PREFS_AGENDA_JOB_GOLD_PRICE_UPDATER,function(job,done){
      WORKER.goldPrice.updateGoldPrice();
      done();
  });
}

init();
