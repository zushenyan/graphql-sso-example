jest.mock("utils/facebook-auth/auth.js");
jest.mock("utils/google-auth/auth.js");

const app           = require("app.js");
const supertest     = require("supertest");
const knex          = require("db/knex.js");
const cookieKeys    = require("config/cookie-keys.js");
const routes        = require("config/routes.js");
const { createJWT } = require("utils/jwt.js");
const facebookAuth  = require("utils/facebook-auth/auth.js");
const googleAuth    = require("utils/google-auth/auth.js");
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
    about
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
      about
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
            "password": "11111111"
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
      it("should set cookie when sign in successfully", async () => {
        const fakeUser = await facebookAuth();
        const variables = `
          {
            "userId": "I dont care",
            "accessToken": "whatever"
          }
        `;
        const query = `
          mutation signInWithFacebook($userId: String!, $accessToken: String!){
            signInWithFacebook(userId: $userId, accessToken: $accessToken){
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
              const result = res.body.data.signInWithFacebook;
              expect(result.status).toEqual("200");
              expect(result).toMatchObject({
                facebook_id: fakeUser.id,
                email:       fakeUser.email
              });
              expect(res.header["set-cookie"].length).toBeGreaterThan(0);
            }
          })
          .expect(200);
      });
    });

    describe("signInWithGoogle", () => {
      it("should set cookie when sign in successfully", async () => {
        const fakeUser = await googleAuth();
        const variables = `
          {
            "token": "I dont care"
          }
        `;
        const query = `
          mutation signInWithGoogle($token: String!){
            signInWithGoogle(token: $token){
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
              const result = res.body.data.signInWithGoogle;
              expect(result.status).toEqual("200");
              expect(result).toMatchObject({
                google_id: fakeUser.id,
                email:     fakeUser.email
              });
              expect(res.header["set-cookie"].length).toBeGreaterThan(0);
            }
          })
          .expect(200);
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
