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
      const user = await User.findById(req.user.id)
        .select("-password -createdAt -updatedAt -__v")
        .exec();
      if (user) {
        data = [user];
        res.json({
          status: "ok",
          msg: `Get profile success! Showing ${data.length} record`,
          data: data,
        });
      } else {
        res.status(404);
        res.json({
          status: "failed",
          msg: `User not found!`,
          data: [],
        });
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
      //using bcrypt in controller
      // const valid = await bcrypt.compare(password, user.password);
      if (user && (await user.matchPassword(password))) {
        res.json({
          _id: user._id,
          hasRestaurant: user.hasRestaurant,
          token: genJwtToken(user._id),
        });
      } else {
        res.status(401);
        res.json({
          status: "failed",
          msg: "Invalid email or password",
          data: [],
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  userProfileUpdateHandler: async (req, res, next) => {
    try {
      const updateData = await User.findOneAndUpdate(
        { _id: req.body._id },
        { $set: { ...req.body } }
      ).exec();
      console.log(updateData);
      if (updateData) {
        res.status(200);
        res.json({
          status: "ok",
          msg: "Data successfully updated",
          data: updateData,
        });
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: "failed",
        msg: "Data unable to update",
        data: [],
      });
    }
  },
};

module.exports = userController;
