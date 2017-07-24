const {
  consoleLogger,
  fileLogger
} = require("./logger.js");
const { createInternalError }   = require("utils/http-status-builder.js");

module.exports = async (fn) => {
  try {
    return await fn();
  }
  catch(e){
    consoleLogger.error(e);
    fileLogger.error(e);
    return createInternalError();
  }
};
