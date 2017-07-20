const buildMessage = (status, message) => ({
  status,
  message
});

const createInternalError = () => buildMessage(
  500,
  "internal server error"
);

const createOk = (status) => buildMessage(
  status,
  "ok"
);

module.exports = {
  buildMessage,
  createInternalError,
  createOk
};
