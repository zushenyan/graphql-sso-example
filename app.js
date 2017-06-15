const path         = require("path");
const express      = require("express");
const morgan       = require("morgan");
const cookieParser = require("cookie-parser");
const graphqlHTTP  = require("express-graphql");
const schema       = require("./api");

const PORT = 8888;

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

const app =
  express()
    .use(morgan("combined"))
    .use(cookieParser())
    .use(graphqlAPI)
    .use(sitePage)
    .listen(PORT, () => {
      console.log(`server is running on port ${PORT}...`);
    });
