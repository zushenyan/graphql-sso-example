const userController = require("controller/user.js");
const knex           = require("db/knex.js");
const { createJWT }  = require("utils/jwt.js");

describe("controller/user.js", () => {
  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.destroy();
  });

  beforeEach(async () => {
    await knex.seed.run();
  });

  describe("generatePublicUserInfo", () => {
    it("should work", () => {
      const user = {
        id:          123,
        email:       "ggyy@test.com",
        facebook_id: "facebookoooo",
        google_id:   "googleoooo",
        created_at:  "created_at",
        updated_at:  "updated_at",
        about:       "lalala",
        trash:       "i shouldn't be here",
        another_key: "aaaaa"
      };
      const result = userController.generatePublicUserInfo(user);
      expect(result).toMatchSnapshot();
    });
  });

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      await expect(userController.getAllUsers()).resolves.toMatchObject({ status: "200" });
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user successfully", async () => {
      const jwt    = createJWT(1);
      await expect(userController.getCurrentUser({ jwt })).resolves.toMatchObject({ status: "200" });
    });

    it("should throw error when token is invalid", async () => {
      const jwt = "blah.blah.blah";
      await expect(userController.getCurrentUser({ jwt })).resolves.toMatchSnapshot();
    });

    it("should response 404 when id is not found", async () => {
      const jwt = createJWT(6);
      await expect(userController.getCurrentUser({ jwt })).resolves.toMatchSnapshot();
    });
  });

  describe("updateUser", () => {
    it("should update user", async () => {
      const user = await knex("users").where({ id: 1 }).first();
      const jwt  = createJWT(user.id);
      const data = {
        id:         5566,
        email:      "another_email@test.com",
        created_at: "ihiooi",
        updated_at: "yooo"
      };
      const result  = await userController.updateUser({ jwt, data });
      expect(result.id).toEqual(user.id);
      expect(result.created_at).toEqual(user.created_at);
      expect(result.email).not.toEqual(user.email);
      expect(result.updated_at).not.toEqual(user.updated_at);
    });

    it("should fail when trying to set email owned by other user for current user", async () => {
      const user = await knex("users").where({ id: 1 }).first();
      const jwt  = createJWT(2);
      const data = { email: user.email };
      await expect(userController.updateUser({ jwt, data })).rejects.toMatchSnapshot();
    });
  });

  describe("signUp", () => {
    it("should sign up successfully", async () => {
      const data = {
        email:           "totally_new@test.com",
        password:        "12345678",
        confirmPassword: "12345678"
      };
      await expect(userController.signUp(data)).resolves.toMatchObject({ status: "200" });
    });

    it("should fail when password doesn't match with confirmation password", async () => {
      const data1 = {
        email:           "totally_new@test.com",
        password:        "9999",
        confirmPassword: "8888"
      };
      const data2 = {
        email:           "test@foobar.com",
        password:        "1234567",
        confirmPassword: "1234567"
      };
      await expect(userController.signUp(data1)).resolves.toMatchSnapshot();
      await expect(userController.signUp(data2)).resolves.toMatchSnapshot();
    });

    it("should fail when email already exists", async () => {
      const user = await knex("users").where({ id: 1 }).first();
      const data = {
        email:           user.email,
        password:        "12345678",
        confirmPassword: "12345678"
      };
      await expect(userController.signUp(data)).resolves.toMatchSnapshot();
    });
  });

  describe("signIn", () => {
    it("should sign in user successfully", async () => {
      const user  = await knex("users").where({ id: 1 }).first();
      const data  = {
        email:    user.email,
        password: "11111111"
      };
      await expect(userController.signIn(data)).resolves.toMatchObject({ status: "200" });
    });

    it("should not let user sign in when input wrong credential", async () => {
      const user  = await knex("users").where({ id: 1 }).first();
      const data1 = {
        email:    user.email,
        password: "abosoulte not this one"
      };
      const data2 = {
        email:    "nosuchemail@test.com",
        password: "happyfoobar"
      };
      await expect(userController.signIn(data1)).resolves.toMatchSnapshot();
      await expect(userController.signIn(data2)).resolves.toMatchSnapshot();
    });
  });

  describe("signInWithSSO", () => {
    it("should create account with facebook profile", async () => {
      const vendorVerification = () => ({
        id:    "fake_facebook_id",
        email: "foobar123@test.com"
      });
      const result = await userController.signInWithSSO(vendorVerification, "facebook_id");
      expect(result.token).toBeDefined();
    });

    it("should update account with facebook id when sign in", async () => {
      const existUser = await knex("users").where({ id: 1 }).first();
      const vendorVerification = () => ({
        id:    "weeeeeeee",
        email: existUser.email
      });
      const result = await userController.signInWithSSO(vendorVerification, "facebook_id");
      expect(result.token).toBeDefined();
      expect(result.facebook_id).toBeDefined();
    });

    it("should create account with google profile", async () => {
      const vendorVerification = () => ({
        id:    "fake_google_id",
        email: "meowmeow@test.com"
      });
      const result = await userController.signInWithSSO(vendorVerification, "google_id");
      expect(result.token).toBeDefined();
    });

    it("should update account with google id when sign in", async () => {
      const existUser = await knex("users").where({ id: 1 }).first();
      const vendorVerification = () => ({
        id:    "fake_google_id",
        email: existUser.email
      });
      const result    = await userController.signInWithSSO(vendorVerification, "google_id");
      expect(result.token).toBeDefined();
      expect(result.google_id).toBeDefined();
    });

    it("should fail", async () => {
      expect(userController.signInWithSSO(() => ({}), "facebook_id")).rejects.toMatchSnapshot();
      expect(userController.signInWithSSO(() => ({
        id:    "1234",
        email: "weeee@test.com"
      }), "no_such_column")).rejects.toMatchSnapshot();
    });
  });

  describe("signOut", () => {
    it("should work", () => {
      expect(userController.signOut()).toMatchObject({ status: "200" });
    });
  });
});
