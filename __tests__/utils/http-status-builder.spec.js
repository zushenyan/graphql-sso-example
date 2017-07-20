const {
  buildMessage,
  createInternalError,
  createOk
} = require("utils/http-status-builder.js");

describe("", () => {
  describe("buildMessage", () => {
    it("should work", () => {
      const result = {
        status:  456,
        message: "lalal"
      };
      expect(buildMessage(result.status, result.message)).toEqual(result);
    });
  });

  describe("createInternalError", () => {
    it("should work", () => {
      expect(createInternalError()).toMatchSnapshot();
    });
  });

  describe("createOk", () => {
    it("should work", () => {
      expect(createOk(123)).toMatchSnapshot();
    });
  });
});
