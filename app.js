const path         = require("path");
const express      = require("express");
const morgan       = require("morgan");
const cors         = require("cors");
const helmet       = require("helmet");
const cookieParser = require("cookie-parser");
const graphqlHTTP  = require("express-graphql");
const schema       = require("api/graphql");
const logger       = require("utils/logger.js");

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
    .use(cors())
    .use(helmet())
    .use(morgan("dev", { stream: logger.consoleStream }))
    .use(morgan("common", { stream: logger.fileStream }))
    .use(cookieParser())
    .use(graphqlAPI)
    .use(sitePage);
