const {
  createJWT,
  verifyJWT,
  getJWT
} = require("./jwt.js");

describe("utils/jwt.js", () => {
  describe("createJWT", () => {
    it("should create JWT", () => {
      const id      = 123;
      const payload = { foo: "bar" };
      expect(createJWT(id, payload)).toBeDefined();
    });
  });

  describe("verifyJWT", () => {
    it("should verify JWT ", () => {
      const id      = 123;
      const payload = { foo: "bar" };
      const token   = createJWT(id, payload);
      const result  = verifyJWT(token);
      expect(result).toBeDefined();
    });

    it("invalid token", () => {
      const result = verifyJWT("not a token");
      expect(result).toHaveProperty("error");
    });
  });

  describe("getJWT", () => {
    it("should get JWT from header", () => {
      const expectedToken = "1234567";
      const req = {
        get: (headerName) => headerName === "Authorization" ? `bearer ${expectedToken}` : undefined,
        cookies: {}
      };
      const token = getJWT(req);
      expect(token).toEqual(expectedToken);
    });

    it("should get JWT from cookie", () => {
      const expectedToken = "1234567";
      const req = {
        get:     () => undefined,
        cookies: { token: expectedToken }
      };
      const token = getJWT(req);
      expect(token).toEqual(expectedToken);
    });

    it("should get nothing", () => {
      const req = {
        get:     () => undefined,
        cookies: {}
      };
      const token = getJWT(req);
      expect(token).toEqual("");
    });
  });
});
