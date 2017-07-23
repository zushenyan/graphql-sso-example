const { consoleLogger: logger } = require("./logger.js");
const { createInternalError }   = require("utils/http-status-builder.js");

module.exports = async (fn) => {
  try {
    return await fn();
  }
  catch(e){
    logger.error(e);
    return createInternalError();
  }
};
