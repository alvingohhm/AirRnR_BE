const User = require("../models/user");
const userSeed = require("../data/userSeed");
const genJwtToken = require("../utils/generateToken");

const userController = {
  seedMockData: async (req, res) => {
    try {
      await User.deleteMany({});
      await User.create(userSeed, (err, data) => {
        if (err) throw err;
        res.json({ status: "ok", msg: "User Mock Data Saved!" });
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: "failed",
        msg: "Problem Saving User Mock Data!",
      });
    }
  },

  userProfileHandler: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).exec();
      if (user) {
        data = [user];
        res.json({
          status: "ok",
          msg: `Get profile success! Showing ${data.length} record`,
          data: data,
        });
      } else {
        res.status(404);
        return next(Error("User not found!"));
      }
    } catch (error) {
      return next(Error("Cannot get user profile!"));
    }
  },

  getUserById: async (req, res, next) => {
    try {
      await User.findById(req.params.id).exec((err, response) => {
        if (err) {
          return next(Error("System error occurs while finding user"));
          // if (process.env.NODE_ENV !== "production") {
          //   return next(new Error(err.message));
          // } else {
          //   return next(new Error("System error occurs while finding user"));
          // }
        }
        if (response) {
          let data = null;
          Array.isArray(response) ? (data = response) : (data = [response]);
          res.json({
            status: "ok",
            msg: `Get Data Success! Showing ${data.length} record`,
            data: data,
          });
        } else {
          res.status(404);
          res.json({
            status: "failed",
            msg: "User not found!",
          });
        }
      });
    } catch (error) {
      console.error(error);
      res.json({
        status: "failed",
        msg: "Problem Getting Data!",
      });
    }
  },

  registerUserHandler: async (req, res, next) => {
    try {
      const { email } = req.body;
      const userExist = await User.findOne({ email }).exec();
      if (userExist) {
        res.status(401);
        return next(Error("User already exists!"));
      }
      // if using bcrypt in controller uncomment below
      // const hashPassword = await bcrypt.hash(req.body.password, 12);
      // req.body.password = hashPassword

      //user password encrypt is handle by model pre save middleware
      const user = await User.create(req.body);
      if (user) {
        res.status(201);
        res.json({
          _id: user._id,
          hasRestaurant: user.hasRestaurant,
          token: genJwtToken(user._id),
        });
      } else {
        res.status(400);
        return next(Error("Failed to register, invalid data!"));
      }
    } catch (error) {
      return next(error);
    }
  },

  loginHandler: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })
        .select("password hasRestaurant")
        .exec();
      //using bcrypt in user model
      const valid = await user.matchPassword(password);
      //using bcrypt in controller
      // const valid = await bcrypt.compare(password, user.password);
      if (user && valid) {
        res.json({
          _id: user._id,
          hasRestaurant: user.hasRestaurant,
          token: genJwtToken(user._id),
        });
      } else {
        res.status(401);
        return next(Error("Invalid email or password"));
      }
    } catch (error) {
      return next(error);
    }
  },
};

module.exports = userController;
