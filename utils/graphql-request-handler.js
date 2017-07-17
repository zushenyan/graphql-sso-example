const { createInternalError } = require("utils/http-status-builder.js");

module.exports = (fn) => {
  try {
    return fn();
  }
  catch(e){
    console.error(e);
    return createInternalError();
  }
};
