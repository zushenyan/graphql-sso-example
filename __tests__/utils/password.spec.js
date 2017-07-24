const {
  genHash,
  genHashSync,
  compareHash,
  compareHashSync,
  validatePassword
} = require("utils/password.js");

describe("", () => {
  const password = "12345";

  describe("genHash", () => {
    it("should work", async () => {
      await expect(genHash(password)).resolves.toBeDefined();
    });
  });

  describe("genHashSync", () => {
    it("should work", () => {
      expect(genHashSync(password)).toBeDefined();
    });
  });

  describe("compareHash", () => {
    it("should work", async () => {
      const hash = await genHash(password);
      await expect(compareHash(password, hash)).resolves.toEqual(true);
    });

    it("should throw error", async () => {
      const hash = await genHash(password);
      await expect(compareHash("assaasas", hash)).resolves.toEqual(false);
    });
  });

  describe("compareHashSync", () => {
    it("should work", () => {
      const hash = genHashSync(password);
      expect(compareHashSync(password, hash)).toEqual(true);
    });

    it("should throw error", () => {
      const hash = genHashSync(password);
      expect(compareHashSync("assaasas", hash)).toEqual(false);
    });
  });

  describe("validatePassword", () => {
    it("should work", () => {
      expect(validatePassword("12345678")).toEqual(true);
    });

    it("should not work", () => {
      expect(validatePassword("1234567")).toEqual(false);
      expect(validatePassword(undefined)).toEqual(false);
      expect(validatePassword(12345678)).toEqual(false);
      expect(validatePassword({ length: 8 })).toEqual(false);
    });
  });

});
