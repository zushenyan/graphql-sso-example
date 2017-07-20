const knex      = require("db/knex.js");
const userModel = require("models/user.js");

describe("models/user.js", () => {
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

  describe("find", () => {
    it("should find rows", async () => {
      const query = { id: 1 };
      const data1 = await userModel.find(query);
      const data2 = await knex("users").where(query).first();
      expect(data1[0]).toEqual(data2);
    });
  });

  describe("getAll", () => {
    it("should get all rows", async () => {
      const data1 = await userModel.getAll();
      const data2 = await knex("users").select();
      expect(data1).toEqual(data2);
    });
  });

  describe("create", () => {
    it("should create a row", async () => {
      const user  = { email: "foobar@test.com", password: "5566" };
      const data1 = (await userModel.create(user))[0];
      const data2 = await knex("users").orderBy("created_at", "desc").first();
      expect(data1).toEqual(data2);
    });

    it("should throw error with absent of options", async () => {
      await expect(userModel.create({ password: "1234" })).rejects.toMatchSnapshot();
      await expect(userModel.create({ email: "hahaha@test.com" })).rejects.toMatchSnapshot();
    });

    it("should throw error when trying to create a row with duplciated unique columns", async () => {
      const facebook_id = "foo";
      const google_id   = "bar";
      const query       = { id: 1 };
      const data        = await knex("users").where("id", 1).first();
      await knex("users").where(query).update({ facebook_id, google_id });
      await expect(userModel.create({ email: data.email, password: "123456" })).rejects.toMatchSnapshot();
      await expect(userModel.create({ email: "foo@test.com", password: "123456", facebook_id })).rejects.toMatchSnapshot();
      await expect(userModel.create({ email: "bar@test.com", password: "123456", google_id })).rejects.toMatchSnapshot();
    });
  });

  describe("update", () => {
    const newData = { email: "hahah@test.com", password: "9999", facebook_id: "foo", google_id: "bar" };

    it("should update rows and its updated_at", async () => {
      const query = { id: 1 };
      const data1 = await knex("users").where(query).first();
      const data2 = (await userModel.update(query, newData))[0];
      expect(data1).not.toEqual(data2);
      expect(data1.updated_at).not.toEqual(data2.updated_at);
    });

    it("should update nothing when it's not found", async () => {
      const query = { id: 10 };
      const data = await userModel.update(query, newData);
      expect(data).toEqual([]);
    });

    it("should throw error when assigning already exist email", async () => {
      const query1 = { id: 1 };
      const query2 = { id: 2 };
      const data1 = await knex("users").where(query1).first();
      await expect(userModel.update(query2, { email: data1.email })).rejects.toMatchSnapshot();
    });
  });
});
