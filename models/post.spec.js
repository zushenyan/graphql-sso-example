const chai           = require("chai");
const chaiAsPromised = require("chai-as-promised");
const knex           = require("../db/knex.js");
const postModel      = require("./post.js");

chai.use(chaiAsPromised);

const assert = chai.assert;

describe("models/post.js", () => {
  before(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    await knex.seed.run();
  });

  describe("findPost", () => {
    it("should find a post", async () => {
      const id = 1;
      const data1 = await postModel.findPost({ "posts.id": id });
      const data2 = await knex("posts").where({ id }).select();
      assert(data1, data2);
    });
  });

  describe("getAllPosts", () => {
    it("should get all posts", async () => {
      const data1 = await postModel.getAllPosts();
      const data2 = await knex("posts").select();
      assert(data1, data2);
    });
  });

  describe("createPost", () => {
    it("should create a post", async () => {
      const user  = { user_id: 1, title: "foobar is good", content: "whahahah" };
      const data1 = await postModel.createPost(user).first();
      const data2 = await knex("posts").select().orderBy("created_at", "desc").first();
      assert(data1, data2);
    });

    it("should throw error with absent of options", async () => {
      assert.isRejected(postModel.createPost({ title: "1234" }));
      assert.isRejected(postModel.createPost({ content: "kkkkk" }));
    });
  });

  describe("updatePost", () => {
    const newData = { title: "aaaa", content: "bbbb" };

    it("should update post and its updated_at", async () => {
      const id    = 1;
      const data1 = await knex("posts").where({ id }).first();
      const data2 = await postModel.updatePost({ id }, newData).first();
      assert.notEqual(data1, data2);
      assert.notEqual(data1.updated_at, data2.updated_at);
    });

    it("should update nothing when post not found", async () => {
      const data = await postModel.updatePost({ id: 10 }, newData);
      assert(data, []);
    });
  });

  describe("deletePost", () => {
    it("should delete post", async () => {
      const id = 1;
      const data1 = await postModel.deletePost({ id }).first();
      const data2 = await knex("posts").where({ id }).first();
      console.log(data1);
      console.log(data2);
      assert(data2, undefined);
    });

    it("should delete nothing when post doesn't exist", async () => {
      const data = await postModel.deletePost({ id: 20 });
      assert(data, []);
    });
  });
});
