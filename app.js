const path         = require("path");
const express      = require("express");
const morgan       = require("morgan");
const cors         = require("cors");
const cookieParser = require("cookie-parser");
const graphqlHTTP  = require("express-graphql");
const schema       = require("./api/graphql");

const sitePage =
  express()
    .get("/facebook", (req, res) => {
      res.sendFile(path.resolve(__dirname, "./public/facebook.html"));
    })
    .get("/google", (req, res) => {
      res.sendFile(path.resolve(__dirname, "./public/google.html"));
    });

const graphqlAPI =
  express()
    .use("/graphql", graphqlHTTP((req, res) => ({
      schema,
      graphiql: true,
      context: { req, res }
    })));

module.exports =
  express()
    .use(morgan("combined"))
    .use(cors())
    .use(cookieParser())
    .use(graphqlAPI)
    .use(sitePage);
