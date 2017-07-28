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
    .use(express.static(path.resolve(__dirname, "./public/spa")))
    .get("/", (req, res) => {
      res.sendFile(path.resolve(__dirname, "./public/spa/index.html"));
    });

const graphqlAPI =
  express()
    .use("/graphql", graphqlHTTP((req, res) => ({
      schema,
      graphiql: process.env.NODE_ENV !== "production",
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
