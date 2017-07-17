const {
  buildError,
  buildMessage,
  createInternalError
} = require("./http-status-builder.js");

describe("", () => {
  describe("buildError", () => {
    it("should be fine", () => {
      const result = {
        status: 123,
        error:  "weeee"
      };
      expect(buildError(result.status, result.error)).toEqual(result);
    });
  });

  describe("buildMessage", () => {
    it("should be fine", () => {
      const result = {
        status:  456,
        message: "lalal"
      };
      expect(buildMessage(result.status, result.message)).toEqual(result);
    });
  });

  describe("createInternalError", () => {
    it("should be fine", () => {
      expect(createInternalError()).toEqual({
        status: 500,
        error: "internal server error"
      });
    });
  });
});
