const fetchQL = require("utils/fetchQL.js");
const knex    = require("db/knex.js");
const schema  = require("./index.js");

describe("", () => {
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

  describe("queries", () => {
    describe("getAllUsers", () => {
      it("should work", async () => {
        const variables = ``;
        const query = `
          {
            getAllUsers{
              id
            }
          }
        `;
        const result = await fetchQL("http://localhost:8888/graphql", query, variables);
        if(result.errors) console.log(result);
        expect(result.getAllUsers).toBeDefined();
      });
    });

    describe("getCurrentUser", () => {
      it("should work", async () => {
        
      });
    });

  });

});
