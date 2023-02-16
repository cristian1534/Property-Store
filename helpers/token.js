const jwt = require("jsonwebtoken");

const createId = () =>
  Math.random().toString(32).substring(2) + Date.now().toString(32);

const createJWT = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

module.exports = { createId, createJWT };
