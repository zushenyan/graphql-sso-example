const buildError = (status, error) => ({
  status,
  error
});

const buildMessage = (status, message) => ({
  status,
  message
});

const createInternalError = () => buildError(
  500,
  "internal server error"
);

module.exports = {
  buildError,
  buildMessage,
  createInternalError
};
