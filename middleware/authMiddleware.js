const jwt = require("jsonwebtoken");
const User = require("../models/user");

const protect = async (req, res, next) => {
  let token;

  if (
    "authorization" in req.headers &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("_id").exec();
      next();
    } catch (error) {
      res.status(401);
      return next(Error(`Authorization Error, token failed`));
    }
  }

  if (!token) {
    res.status(401);
    return next(Error("Not authorized. Missing token"));
  }
};

module.exports = protect;
