const userController = require("./user.js");
const knex           = require("../db/knex.js");
const { createJWT }  = require("../utils/jwt.js");

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
        created_at:  Date.now(),
        updated_at:  Date.now(),
        trash:       "i shouldn't be here",
        another_key: "aaaaa"
      };
      const result = userController.generatePublicUserInfo(user);
      expect(result).toEqual({
        id:          user.id,
        email:       user.email,
        facebook_id: user.facebook_id,
        google_id:   user.google_id,
        created_at:  user.created_at,
        updated_at:  user.updated_at
      });
    });
  });

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const users1   = await knex("users").select();
      const users2   = await userController.getAllUsers();
      const expected = users1.map(userController.generatePublicUserInfo);
      expect(users2).toEqual(expected);
    });
  });

  describe("getCurrentUser", () => {
    it("should get current user successfully", async () => {
      const query    = { id: 1 };
      const user     = await knex("users").where(query).first();
      const jwt      = createJWT(query.id, {});
      const result   = await userController.getCurrentUser({ jwt });
      const expected = userController.generatePublicUserInfo(user);
      expect(result).toEqual(expected);
    });

    it("should throw error when token is invalid", async () => {
      const jwt = createJWT(5566, {});
      expect(userController.getCurrentUser({ jwt })).rejects.toBeDefined();
    });
  });

  describe("updateUser", () => {
    it("should update user", async () => {
      const query = { id: 1 };
      const user    = await knex("users").where(query).first();
      const token   = createJWT(user.id);
      const newData = {
        id:         5566,
        email:      "another_email@test.com",
        created_at: "ihiooi",
        updated_at: "yooo"
      };
      const result  = await userController.updateUser({ token, newData });
      expect(result.id).toEqual(user.id);
      expect(result.created_at).toEqual(user.created_at);
      expect(result.email).not.toEqual(user.email);
      expect(result.updated_at).not.toEqual(user.updated_at);
    });

    it("should fail when trying to set email owned by other user for current user", async () => {
      const query = { id: 1 };
      const user    = await knex("users").where(query).first();
      const token   = createJWT(2);
      const newData = { email: user.email };
      expect(userController.updateUser({ token, newData })).rejects.toBeDefined();
    });
  });

  describe("signUp", () => {
    it("should sign up successfully", async () => {
      const data = {
        email:           "totally_new@test.com",
        password:        "9999",
        confirmPassword: "9999"
      };
      expect(userController.signUp(data)).resolves.toBeDefined();
    });

    it("should fail when password doesn't match with confirmation password", async () => {
      const data = {
        email:           "totally_new@test.com",
        password:        "9999",
        confirmPassword: "8888"
      };
      expect(userController.signUp(data)).rejects.toBeDefined();
    });

    it("should fail when email already exists", async () => {
      const query = { id: 1 };
      const user  = await knex("users").where(query).first();
      const data  = {
        email:           user.email,
        password:        "9999",
        confirmPassword: "9999"
      };
      expect(userController.signUp(data)).rejects.toBeDefined();
    });
  });

  describe("signIn", () => {
    it("should sign in user successfully", async () => {
      const query = { id: 1 };
      const user  = await knex("users").where(query).first();
      const data  = {
        email:    user.email,
        password: user.password
      };
      expect(await userController.signIn(data)).toBeDefined();
    });

    it("should not let user sign in when input wrong credential", async () => {
      const query = { id: 1 };
      const user  = await knex("users").where(query).first();
      const data1 = {
        email:    user.email,
        password: "abosoulte not this one"
      };
      const data2 = {
        email:    "nosuchemail@test.com",
        password: "happyfoobar"
      };
      expect(userController.signIn(data1)).rejects.toBeDefined();
      expect(userController.signIn(data2)).rejects.toBeDefined();
    });
  });

  describe("signInWithSSO", () => {
    it("should create account with facebook profile", async () => {
      const result         = await userController.signInWithSSO(
        () => ({
          id:    "fake_facebook_id",
          email: "foobar123@test.com"
        }),
        "facebook_id"
      );
      const user           = await knex("users").where({ id: result.id }).first();
      const publicUserInfo = userController.generatePublicUserInfo(user);
      expect(result.token).toBeDefined();
      delete result.token;
      expect(result).toEqual(publicUserInfo);
    });

    it("should update account with facebook id when sign in", async () => {
      const query      = { id: 1 };
      const existUser  = await knex("users").where(query).first();
      const result     = await userController.signInWithSSO(
        () => ({
          id:    "weeeeeeee",
          email: existUser.email
        }),
        "facebook_id"
      );
      expect(result.token).toBeDefined();
      expect(result.facebook_id).toBeDefined();
    });

    it("should create account with google profile", async () => {
      const result         = await userController.signInWithSSO(
        () => ({
          id:    "fake_google_id",
          email: "meowmeow@test.com"
        }),
        "google_id"
      );
      const user           = await knex("users").where({ id: result.id }).first();
      const publicUserInfo = userController.generatePublicUserInfo(user);
      expect(result.token).toBeDefined();
      delete result.token;
      expect(result).toEqual(publicUserInfo);
    });

    it("should update account with google id when sign in", async () => {
      const query     = { id: 1 };
      const existUser = await knex("users").where(query).first();
      const result    = await userController.signInWithSSO(
        () => ({
          id:    "fake_google_id",
          email: existUser.email
        }),
        "google_id"
      );
      expect(result.token).toBeDefined();
      expect(result.google_id).toBeDefined();
    });

    it("should fail", async () => {
      expect(userController.signInWithSSO(() => ({}), "facebook_id")).rejects.toBeDefined();
      expect(userController.signInWithSSO(() => ({
        id:    "1234",
        email: "weeee@test.com"
      }), "no_such_column")).rejects.toBeDefined();
    });
  });

  describe("signOut", () => {
    it("should work", async () => {
      expect(await userController.signOut()).toBeDefined();
    });
  });
});
