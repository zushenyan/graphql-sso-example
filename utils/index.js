const jwt  = require("jsonwebtoken");
const uuid = require("uuid/v4");

const JWT_SECRET = "not hotdog";

const createJwt = (id, payload = {}) => jwt.sign(
  payload,
  JWT_SECRET,
  {
    subject:   id,
    expiresIn: 30
  }
);

const verifyJwt = (token) => jwt.verify(token, JWT_SECRET);

const getToken = (req) => {
  const authorizationHeader = req.get("Authorization") || "";
  const fromHeader          = authorizationHeader.split(" ")[1];
  const fromCookie          = req.cookies["token"] || "";
  const token               = fromHeader || fromCookie;
  return token;
};

const generateID = () => uuid().substr(0, 6);

module.exports = {
  createJwt,
  verifyJwt,
  getToken,
  generateID
};
