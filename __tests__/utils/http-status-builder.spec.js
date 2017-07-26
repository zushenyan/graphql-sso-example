const {
  buildMessage,
  createInternalError,
  createOk
} = require("utils/http-status-builder.js");

describe("", () => {
  describe("buildMessage", () => {
    it("should work", () => {
      const result1 = {
        status:  456,
        message: "lalal"
      };
      const result2 = {
        status:  "456",
        message: "lalal"
      };
      const output1 = buildMessage(result1.status, result1.message);
      const output2 = buildMessage(result2.status, result2.message);
      expect(output1).toEqual(result2);
      expect(output2).toEqual(result2);
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
