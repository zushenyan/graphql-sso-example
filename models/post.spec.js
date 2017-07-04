const knex      = require("../db/knex.js");
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
      const post  = { user_id: 1, title: "foobar is good", content: "whahahah" };
      const data1 = await postModel.create(post);
      const data2 = await knex("posts").orderBy("created_at", "desc").first();
      expect(data1[0]).toEqual(data2);
    });

    it("should throw error with absent of options", async () => {
      expect(postModel.create({ title: "1234" })).rejects.toBeDefined();
      expect(postModel.create({ content: "kkkkk" })).rejects.toBeDefined();
    });
  });

  describe("update", () => {
    const newData = { title: "aaaa", content: "bbbb" };

    it("should update rows and its updated_at", async () => {
      const query = { id: 1 };
      const data1 = await knex("posts").where(query).first();
      const data2 = await postModel.update(query, newData);
      expect(data1).not.toEqual(data2[0]);
      expect(data1.updated_at).not.toEqual(data2[0].updated_at);
    });

    it("should update nothing when it's not found", async () => {
      const query = { id: 20 };
      const data = await postModel.update(query, newData);
      expect(data).toEqual([]);
    });
  });

  describe("delete", () => {
    it("should delete rows", async () => {
      await knex("comments").truncate();
      const query = { id: 1 };
      const data1 = await postModel.del(query);
      const data2 = await knex("posts").where(query).first();
      expect(data2).toBe(undefined);
    });

    it("should delete nothing when it doesn't exist", async () => {
      const data = await postModel.del({ id: 20 });
      expect(data).toEqual([]);
    });
  });
});
