var log4js = require("log4js");

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'logs/blog.log', category: 'info' }
  ]
});
var logger = log4js.getLogger("info");
logger.setLevel("INFO");

module.exports = logger;