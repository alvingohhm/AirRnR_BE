const jwt = require("jsonwebtoken");

const genJwtToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = genJwtToken;
