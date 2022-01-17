const User = require("../models/user");
const userSeed = require("../data/userSeed");

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

  createUser: async (req, res) => {
    const hashPassword = await bcrypt.hash("password", 12);
    res.send(hashPassword);
  },

  authUser: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email })
        .select("password name email hasRestaurant")
        .exec();
      //using bcrypt in user model
      const valid = await user.matchPassword(password);
      //using bcrypt in controller
      // const valid = await bcrypt.compare(password, user.password);
      if (user && valid) {
        user.token = "1222";
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          hasRestaurant: user.hasRestaurant,
          token: null,
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
