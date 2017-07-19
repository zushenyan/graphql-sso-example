const { createInternalError } = require("utils/http-status-builder.js");

module.exports = async (fn) => {
  try {
    return await fn();
  }
  catch(e){
    console.error(e);
    return createInternalError();
  }
};
