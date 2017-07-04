const knex           = require("../db/knex.js");
const userController = require("./user.js");
const userModel      = require("../models/user.js");

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

  describe("getAllUsers", () => {
    it("should get all users", async () => {
      const users1 = await userModel.getAll();
      const users2 = await userController.getAllUsers();
      const expected = users1.map(({ id, email }) => ({
        id,
        email
      }));
      expect(users2).toEqual(expected);
    });
  });
});
