const app           = require("app.js");
const supertest     = require("supertest");
const knex          = require("db/knex.js");
const cookieKeys    = require("config/cookie-keys.js");
const routes        = require("config/routes.js");
const { createJWT } = require("utils/jwt.js");
const util          = require("util");

const logObject = (obj) => {
  console.log(util.inspect(obj, {
    showHidden: false,
    depth:      null,
    colors:     true
  }));
};

const fragmentResponseType = `
  fragment ResponseType on Response {
    message
    status
  }
`;

const fragmentUserType = `
  fragment UserType on User {
    id
    email
    token
    facebook_id
    google_id
    created_at
    updated_at
    message
    status
  }
`;

const fragmentUserListType = `
  fragment UserListType on UserList {
    users {
      id
      email
      token
      facebook_id
      google_id
      created_at
      updated_at
    },
    message,
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
              ...UserListType
            }
          }
          ${fragmentUserListType}
        `;
        return request
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logObject(res.body);
            else {
              expect(res.body.data.getAllUsers.status).toEqual("200");
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
            if(res.body.errors) logObject(res.body);
            else {
              expect(res.body.data.getCurrentUser.status).toEqual("200");
            }
          })
          .expect(200);
      });

      it("should work with cookie header", () => {
        return request
          .set("Cookie", `${cookieKeys.token}=${jwt}`)
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logObject(res.body);
            else {
              expect(res.body.data.getCurrentUser.status).toEqual("200");
            }
          })
          .expect(200);
      });
    });
  });

  describe("mutations", () => {
    describe("signIn", () => {
      it("should set cookie when sign in successfully", async () => {
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
            if(res.body.errors) logObject(res.body);
            else {
              expect(res.body.data.signIn.status).toEqual("200");
              expect(res.header["set-cookie"].length).toBeGreaterThan(0);
            }
          })
          .expect(200);
      });
    });

    describe("signInWithFacebook", () => {
      it("should set cookie when sign in successfully", () => {
        console.log("can\'t test because sso testing account is not deterministic");
      });
    });

    describe("signInWithGoogle", () => {
      it("should set cookie when sign in successfully", () => {
        console.log("can\'t test because sso testing account is not deterministic");
      });
    });

    describe("signUp", () => {
      it("should set cookie when sign up successfully", async () => {
        const variables = `
          {
            "email": "newUser@test.com",
            "password": "12345678",
            "confirmPassword": "12345678"
          }
        `;
        const query = `
          mutation signUp($email: String!, $password: String!, $confirmPassword: String!){
            signUp(email: $email, password: $password, confirmPassword: $confirmPassword){
              ...UserType
            }
          }
          ${fragmentUserType}
        `;
        return request
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logObject(res.body);
            else {
              expect(res.body.data.signUp.status).toEqual("200");
              expect(res.header["set-cookie"].length).toBeGreaterThan(0);
            }
          })
          .expect(200);
      });
    });

    describe("updateUser", () => {
      it("should set cookie when update user data successfully", async () => {
        const jwt = createJWT(1);
        const data = {
          email: "very_unique@gmail.com"
        };
        const variables = `
          {
            "data": ${JSON.stringify(data)}
          }
        `;
        const query = `
          mutation updateUser($data: UserInput!){
            updateUser(data: $data){
              ...UserType
            }
          }
          ${fragmentUserType}
        `;
        return request
          .set("Authorization", `bearer ${jwt}`)
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logObject(res.body);
            else {
              expect(res.body.data.updateUser.status).toEqual("200");
              expect(res.header["set-cookie"].length).toBeGreaterThan(0);
            }
          })
          .expect(200);
      });
    });

    describe("signOut", () => {
      it("should clear cookie when sign out successfully", async () => {
        const variables = ``;
        const query = `
          mutation signOut{
            signOut{
              ...ResponseType
            }
          }
          ${fragmentResponseType}
        `;
        return request
          .send(JSON.stringify({ query, variables }))
          .expect((res) => {
            if(res.body.errors) logObject(res.body);
            else {
              expect(res.body.data.signOut.status).toEqual("200");
              expect(res.header["set-cookie"].length).toBeGreaterThan(0);
            }
          })
          .expect(200);
      });
    });

  });

});
