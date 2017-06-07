const _               = require("lodash");
const path            = require("path");
const express         = require("express");
const morgan          = require("morgan");
const jwt             = require("jsonwebtoken");
const graphqlHTTP     = require("express-graphql");
const { buildSchema } = require("graphql");

const JWT_SECRET = "not hotdog";
const PORT = 8888;

const users = {
  "1": {
    id: "1",
    email: "foobar@test.com",
    password: "1234",
    message: "this is a default message"
  },
  "2": {
    id: "2",
    email: "ggyy@test.com",
    password: "4321",
    message: "this is a default message"
  }
};

const schema = buildSchema(`
  type Query {
    getUserInfo(id: String!): User
  }

  type Mutation {
    signIn(email: String!, password: String!): AuthorizationToken
    setMessage(message: String!): User!
  }

  type User {
    id: ID
    email: String
    message: String
  }

  type AuthorizationToken {
    token: String
  }
`);

const rootValue = {
  getUserInfo: ({ id }) => {
    const user = users[id];
    if(user) {
      return {
        id:      user.id,
        email:   user.email,
        message: user.message
      }
    }
    throw new Error(`user [${id}] not found`);
  },

  signIn: ({ email, password }, { res }) => {
    const user = _.find(users, (ele) => ele.email === email && ele.password === password);
    if(user) {
      const token = jwt.sign(
        {}, JWT_SECRET,
        {
          subject:   user.id,
          expiresIn: 30
        }
      );
      res.cookie("token", token);
      return { token };
    }
    throw new Error(`Invalid email or password`);
  },

  setMessage: ({ message }, { req, res }) => {
    try {
      const authorization = req.get("Authorization") || "";
      const token         = authorization.split(" ")[1];
      const { sub: id }   = jwt.verify(token, JWT_SECRET);
      const newData       = Object.assign({}, users[id], {
        message
      });
      users[id] = newData;
      return newData;
    }
    catch(err) {
      throw new Error(err.message);
    }
  }
};

const graphqlAPI =
  express()
    .use("/graphql", graphqlHTTP((req, res) => ({
      schema,
      rootValue,
      graphiql: true,
      context: { req, res }
    })));

const app =
  express()
    .use(morgan("combined"))
    .use(graphqlAPI)
    .listen(PORT, () => {
      console.log(`server is running on port ${PORT}...`);
    });
