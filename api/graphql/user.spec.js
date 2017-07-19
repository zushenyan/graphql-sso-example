const app           = require("app.js");
const supertest     = require("supertest");
const knex          = require("db/knex.js");
const cookieKeys    = require("config/cookie-keys.js");
const routes        = require("config/routes.js");
const { createJWT } = require("utils/jwt.js");
const util = require("util");

const logResponseObject = (obj) => {
  console.log(util.inspect(obj, {
    showHidden: false,
    depth:      null,
    colors:     true
  }));
};

const fragmentUserType = `
  fragment UserType on User {
    id
    email
    token
    facebook_id
    google_id
    created_at
    updated_at
    error
    status
  }
`;

describe("", () => {
  let request = null;

  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    await knex.seed.run();
    request = supertest(app)
      .post(`/${routes.name.graphql}`)
      .type("json");
  });

  afterAll(async () => {
    await knex.destroy();
    app.close();
  });

  describe("queries", () => {
    describe("getAllUsers", () => {
      it("should work", () => {
        const variables = ``;
        const query = `
          {
            getAllUsers{
              ...UserType
            }
          }
          ${fragmentUserType}
        `;
        return request
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logResponseObject(res.body);
            else {
              expect(res.body).toHaveProperty("data");
            }
          })
          .expect(200);
      });
    });

    describe("getCurrentUser", () => {
      const jwt = createJWT(1);
      const variables = ``;
      const query = `
        {
          getCurrentUser{
            ...UserType
          }
        }
        ${fragmentUserType}
      `;
      it("should work with authorization header", () => {

        return request
          .set("Authorization", `bearer ${jwt}`)
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logResponseObject(res.body);
            else {
              expect(res.body).toHaveProperty("data");
            }
          })
          .expect(200);
      });

      it("should work with cookie header", () => {
        return request
          .set("Cookie", `${cookieKeys.token}=${jwt}`)
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logResponseObject(res.body);
            else {
              expect(res.body).toHaveProperty("data");
            }
          })
          .expect(200);
      });

      it("should response error when crendential is bad", () => {
        return request
          .set("Cookie", `${cookieKeys.token}=invalid_token`)
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logResponseObject(res.body);
            else {
              expect(res.body.data.getCurrentUser.status).toEqual("400");
            }
          })
          .expect(200);
      });
    });
  });

  describe("mutations", () => {
    describe("signIn", () => {
      it("should work", async() => {
        const user = await knex("users").where({ id: 1 }).select().first();
        const variables = `
          {
            "email": "${user.email}",
            "password": "${user.password}"
          }
        `;
        const query = `
          mutation signIn($email: String!, $password: String!){
            signIn(email: $email, password: $password){
              ...UserType
            }
          }
          ${fragmentUserType}
        `;
        return request
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logResponseObject(res.body);
            else {
              // logResponseObject(res.body)
              expect(res.body.data).toBeDefined();
            }
          })
          .expect(200);
      });
    });
  });

});
