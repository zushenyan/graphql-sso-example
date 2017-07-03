const chai           = require("chai");
const chaiAsPromised = require("chai-as-promised");
const knex           = require("../db/knex.js");
const userModel      = require("./user.js");

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("models/user.js", () => {
  before(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    await knex.seed.run();
  });

  describe("findUser", () => {
    it("should find a user", async () => {
      const id = 1;
      const data1 = await userModel.findUser({ id });
      const data2 = await knex("users").where({ id }).select();
      assert(data1 === data2, "dasdas");
    });
  });

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const data1 = await userModel.getAllUsers();
      const data2 = await knex("users").select();
      assert(data1 === data2);
    });
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const user  = { email: "foobar@test.com", password: "5566" };
      const data1 = await userModel.createUser(user).first();
      const data2 = await knex("users").select().orderBy("created_at", "desc").first();
      assert(data1 === data2);
    });

    it("should throw error with absent of options", async () => {
      assert.isRejected(userModel.createUser({ password: "1234" }));
      assert.isRejected(userModel.createUser({ email: "hahaha@test.com" }));
    });

    it("should throw error when trying to create account with duplciated email, facebook_id or google_id", async () => {
      const facebook_id = "foo";
      const google_id   = "bar";
      const data        = await knex("users").where("id", 1).first();
      await knex("users").where("id", 1).update({ facebook_id, google_id });
      assert.isRejected(userModel.createUser({ email: data.email, password: "123456" }));
      assert.isRejected(userModel.createUser({ email: "foo@test.com", password: "123456", facebook_id }));
      assert.isRejected(userModel.createUser({ email: "bar@test.com", password: "123456", google_id }));
    });
  });

  describe("updateUser", () => {
    const newData = { email: "hahah@test.com", password: "9999", facebook_id: "foo", google_id: "bar" };

    it("should update user and its updated_at", async () => {
      const id    = 1;
      const data1 = await knex("users").where({ id }).first();
      const data2 = await userModel.updateUser({ id }, newData).first();
      assert(data1 !== data2);
      assert(data1.updated_at !== data2.updated_at);
    });

    it("should update nothing when user not found", async () => {
      const data = await userModel.updateUser({ id: 10 }, newData);
      assert(data === []);
    });

    it("should throw error when assigning already exist email", async () => {
      const data1 = await knex("users").where({ id: 1 }).first();
      let err     = null;
      try { await userModel.updateUser({ id: 2 }, { email: data1.email }); } catch(e) { err = e; }
      assert.exists(err);
    });
  });
});
