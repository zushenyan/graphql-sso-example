const graphqlRequestHandler = require("./graphql-request-handler.js");

describe("", () => {
  describe("request handler", () => {
    it("should work", async () => {
      const num = 42;
      const fn = async () => await Promise.resolve(num);
      await expect(graphqlRequestHandler(fn)).resolves.toEqual(num);
    });

    it("should throw", async () => {
      const fn = async () => await Promise.reject("Q_Q");
      await expect(graphqlRequestHandler(fn)).resolves.toHaveProperty("error");
    });
  });
});
