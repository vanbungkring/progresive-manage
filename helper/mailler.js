var template = require('email-templates').EmailTemplate;
var path = require('path');
var templatesDir = path.resolve(__dirname, GLOBAL_PATH, 'email/template/');
var MAILLER = {
    /**
     * verification donor after register
     * @param  {[type]} receiver [description]
     * @param  {[type]} context  [description]
     * @return {[type]}          [description]
     */
    sendDonorVerificationEmail: function(receiver, context) {
        var locals = {
            context: context,
            receiver:receiver,
            config:GLOBAL_CONFIG.app.public
        };
        var verification = new template(path.join(templatesDir, 'verification'));
        verification.render(locals, function(err, result) {
            var data = {
                from: 'ZISPRO SUPPORT <' + GLOBAL_CONFIG.mailgun.main_sender + '>',
                to: receiver,
                subject: 'Assalamualaikum, selamat datang di ZISPRO',
                html: result.html
            };
            sendmailWithContext(data);
        });
    },

/**
 * [sendDonorWelcomeEmail description]
 * @param  {[type]} receiver [description]
 * @param  {[type]} context  [description]
 * @return {[type]}          [description]
 */
    sendDonorWelcomeEmail: function(receiver, context) {
        var locals = {
            context: context,
            receiver:receiver,
            config:GLOBAL_CONFIG.app.public
        };
        var verification = new template(path.join(templatesDir, 'verification'));
        verification.render(locals, function(err, result) {
            var data = {
                from: 'ZISPRO SUPPORT <' + GLOBAL_CONFIG.mailgun.main_sender + '>',
                to: receiver,
                subject: 'Assalamualaikum, selamat datang di ZISPRO',
                html: result.html
            };
            sendmailWithContext(data);
        });
    },
    /**
     * send password reset request for donor
     * @param {[type]} receiver [description]
     * @param {[type]} context  [description]
     */
    sendResetPassswordRequest: function(receiver, context) {
        var locals = {
            context: context
        };
        var resetPassword = new template(path.join(templatesDir, 'donor-reset-password'));
        resetPassword.render(locals, function(err, result) {
            var data = {
                from: 'ZISPRO SUPPORT <' + GLOBAL_CONFIG.mailgun.main_sender + '>',
                to: receiver,
                subject: 'Permintaan perubahan password',
                html: result.html
            };
            sendmailWithContext(data);
        });
    },
    sendUserVerificationEmail: function(context) {
      console.log(context)
    },
    sendDonorDonationCreated: function(receiver, title, context) {
        var locals = {
            context: context
        };
        var donationCreated = new template(path.join(templatesDir, 'donor-payment-submit'));
        donationCreated.render(locals, function(err, result) {
            var data = {
                from: 'ZISPRO SUPPORT <' + GLOBAL_CONFIG.mailgun.main_sender + '>',
                to: receiver,
                subject: title,
                html: result.html
            };
            sendmailWithContext(data);
        });
    }
};


function sendmailWithContext(context) {
    global.library.MAILGUN.messages().send(context, function(error, body) {});
}
module.exports = MAILLER;
