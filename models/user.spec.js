const chai           = require("chai");
const chaiAsPromised = require("chai-as-promised");
const knex           = require("../db/knex.js");
const userModel      = require("./user.js");

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("user.js", () => {
  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run();
  });

  describe("createUser", () => {
    it("should create a user", async () => {
      const user  = { email: "foobar@test.com", password: "5566" };
      const data1 = await userModel.createUser(user);
      const data2 = await knex("users").where("email", user.email).select();
      assert(data1, data2);
    });

    it("should throw error with absent of options", async () => {
      assert.isRejected(userModel.createUser({ password: "1234" }));
      assert.isRejected(userModel.createUser({ email: "hahaha@test.com" }));
    });

    it("should throw error when trying to create account with duplciated email, facebook_id or google_id", async () => {
      const facebook_id = "foo";
      const google_id   = "bar";
      const data        = await knex("users").where("id", 1).select();
      await knex("users").where("id", 1).update({ facebook_id, google_id });
      assert.isRejected(userModel.createUser({ email: data.email, password: "123456" }));
      assert.isRejected(userModel.createUser({ email: "foo@test.com", password: "123456", facebook_id }));
      assert.isRejected(userModel.createUser({ email: "bar@test.com", password: "123456", google_id }));
    });
  });

  describe("updateUser", () => {
    it("should update user", async () => {
      const newData = { email: "hahah@test.com", password: "9999", facebook_id: "foo", google_id: "bar" };
      const data1   = await userModel.updateUser({ id: 1 }, newData);
      const data2   = await knex("users").where("id", 1).select();
      assert(data1, data2);
    });

    it("should throw error when user not found", () => {

    });

    it("should throw error when assigning already exist email", () => {

    });
  });
});
