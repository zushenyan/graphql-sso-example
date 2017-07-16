const knex      = require("db/knex.js");
const postModel = require("./post.js");

describe("models/post.js", () => {
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
    it("should find a row", async () => {
      const query = { "posts.id": 1 };
      const data1 = await postModel.find(query);
      const data2 = await knex("posts").where(query).join("users", "users.id", "=", "posts.user_id").select();
      expect(data1).toEqual(data2);
    });
  });

  describe("getAll", () => {
    it("should get all rows", async () => {
      const data1 = await postModel.getAll();
      const data2 = await knex("posts").join("users", "users.id", "=", "posts.user_id").select();
      expect(data1).toEqual(data2);
    });
  });

  describe("create", () => {
    it("should create a row", async () => {
      const post  = { user_id: 1, content: "whahahah" };
      const data1 = (await postModel.create(post))[0];
      const data2 = await knex("posts").orderBy("created_at", "desc").first();
      expect(data1).toEqual(data2);
    });

    it("should throw error with absent of options", async () => {
      await expect(postModel.create({ content: "kkkkk" })).rejects.toBeDefined();
    });
  });

  describe("update", () => {
    const newData = { content: "bbbb" };

    it("should update rows and its updated_at", async () => {
      const query = { id: 1 };
      const data1 = await knex("posts").where(query).first();
      const data2 = (await postModel.update(query, newData))[0];
      expect(data1).not.toEqual(data2);
      expect(data1.updated_at).not.toEqual(data2.updated_at);
    });

    it("should update nothing when it's not found", async () => {
      const query = { id: 20 };
      const data = await postModel.update(query, newData);
      expect(data).toEqual([]);
    });
  });

  describe("delete", () => {
    it("should delete rows", async () => {
      const query = { id: 1 };
      const data1 = await postModel.del(query);
      const data2 = await knex("posts").where(query).select("*");
      expect(data2).toEqual([]);
    });

    it("should delete nothing when it doesn't exist", async () => {
      const query = { id: 20 };
      const data  = await postModel.del(query);
      expect(data).toEqual([]);
    });
  });
});
