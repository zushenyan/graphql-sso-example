require("winston-daily-rotate-file");
const path    = require("path");
const winston = require("winston");

const fileLogger = new winston.Logger({
  transports: [
    new winston.transports.DailyRotateFile({
      level:            "info",
      filename:         path.resolve(__dirname, "../logs/log.json"),
      datePattern:      "yyyy-MM-dd.",
      prepend:          true,
      handleExceptions: true,
      json:             true,
      colorize:         false
    })
  ]
});

const consoleLogger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      json:             false,
      colorize:         true,
      level:            process.env.NODE_ENV === "test"        ? "fatal" :
                        process.env.NODE_ENV === "development" ? "debug" : 
                                                                 "info"
    })
  ]
});

module.exports.consoleLogger = consoleLogger;
module.exports.fileLogger    = fileLogger;
module.exports.fileStream = {
  write: (message, encoding) => fileLogger.info(message.slice(0, -1))
};
module.exports.consoleStream = {
  write: (message, encoding) => consoleLogger.info(message.slice(0, -1))
};
