const knex         = require("../db/knex.js");
const commentModel = require("./comment.js");

describe("models/comment.js", () => {
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
      const query = { "comments.id": 1 };
      const data1 = await commentModel.find(query);
      const data2 = await knex("comments")
        .where(query)
        .join("posts", "posts.id", "=", "comments.post_id")
        .join("users", "users.id", "=", "comments.user_id")
        .select("*");
      expect(data1).toEqual(data2);
    });
  });

  describe("getAll", () => {
    it("should get all rows", async () => {
      const data1 = await commentModel.getAll();
      const data2 = await knex("comments")
        .join("posts", "posts.id", "=", "comments.post_id")
        .join("users", "users.id", "=", "comments.user_id")
        .select("*");
      expect(data1).toEqual(data2);
    });
  });

  describe("create", () => {
    it("should create a row", async () => {
      const comment  = { user_id: 1, post_id: 1, content: "weee" };
      const data1 = (await commentModel.create(comment))[0];
      const data2 = await knex("comments").orderBy("created_at", "desc").first();
      expect(data1).toEqual(data2);
    });

    it("should throw error with absent of options", async () => {
      expect(commentModel.create({ title: "1234" })).rejects.toBeDefined();
    });
  });

  describe("update", () => {
    const newData = { content: "bbbb" };

    it("should update rows and its updated_at", async () => {
      const query = { id: 1 };
      const data1 = await knex("comments").where(query).first();
      const data2 = (await commentModel.update(query, newData))[0];
      expect(data1).not.toEqual(data2);
      expect(data1.updated_at).not.toEqual(data2.updated_at);
    });

    it("should update nothing when it's not found", async () => {
      const query = { id: 20 };
      const data  = await commentModel.update(query, newData);
      expect(data).toEqual([]);
    });
  });

  describe("delete", () => {
    it("should delete rows", async () => {
      const query = { id: 1 };
      const data1 = await commentModel.del(query);
      const data2 = await knex("comments").where(query).select("*");
      expect(data2).toEqual([]);
    });

    it("should delete nothing when it doesn't exist", async () => {
      const query = { id: 20 };
      const data = await commentModel.del(query);
      expect(data).toEqual([]);
    });
  });
});
