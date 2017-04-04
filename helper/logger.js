var winston = require('winston');
winston.emitErrs = true;
var SlackWebHook = require('winston-slack-webhook').SlackWebHook;


var logger = new winston.Logger({
  transports: [
    new winston.transports.File({
      level: 'info',
      filename: GLOBAL_PATH + '/helper/logs/all-logs.logs',
      handleExceptions: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: true
    }),
    new SlackWebHook({
      level: 'debug',
      webhookUrl: GLOBAL_CONFIG.slack.hooks,
      channel: GLOBAL_CONFIG.slack.channel,
      username: 'logger'
    })
  ],
  exitOnError: false
});
//curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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''
//
module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message, encoding);

  }
};
