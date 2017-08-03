const protocol = "http";

const domain = "localhost";

const port = process.env.PORT || 8080;

const url = `${protocol}://${domain}:${port}`;

module.exports = {
  protocol,
  domain,
  port,
  url
};
