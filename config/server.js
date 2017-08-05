const protocol = "http";

const domain = "localhost";

const port =
  process.env.NODE_ENV === "production" ? process.env.PORT :
  process.env.NODE_ENV === "development" ? 8888 :
  8887;

const url = `${protocol}://${domain}:${port}`;

module.exports = {
  protocol,
  domain,
  port,
  url
};
